'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getInquiryDetail,
  postReply,
} from '@/features/admin/inquiryDetail/api/textSupportAdminClient';
import styles from './AdminInquiryDetail.module.css';
import type { AdminInquiryDetail } from '../api/getAdminInquiryDetail';

export function AdminInquiryDetailClient({
  id,
  initialData,
}: {
  id: string;
  initialData: AdminInquiryDetail;
}) {
  const router = useRouter();

  const [data, setData] = useState<AdminInquiryDetail>(initialData);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // SSRデータで初期表示しつつ、クライアント側で最新化（既存の挙動に近づける）
  const loadData = useCallback(async () => {
    const res = await getInquiryDetail(id);
    setData(res);
  }, [id]);

  useEffect(() => {
    loadData().catch((e) => console.error('取得失敗:', e));
  }, [loadData]);

  const support = data?.support;
  const messages = useMemo(() => data?.messages ?? [], [data]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await postReply(id, replyText);
      setReplyText('');
      await loadData();
    } catch (e) {
      console.error(e);
      alert('送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  if (!data || !support) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <span>←</span> 戻る
        </button>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{support.name || '匿名'} さんの相談室</h2>
          <span className={support.status === 0 ? styles.statusUnread : styles.statusRead}>
            {support.status === 0 ? '未対応' : '対応済み'}
          </span>
        </div>
      </header>

      <div className={styles.talkArea}>
        <div className={styles.userRow}>
          <div className={styles.userBubble}>
            <div className={styles.bubbleHeader}>件名: {support.subject}</div>
            <p>{support.message}</p>
          </div>
          <span className={styles.time}>{new Date(support.created_at).toLocaleString()}</span>
        </div>

        {messages.map((m: any) => (
          <div key={m.id} className={m.sender_type === 1 ? styles.adminRow : styles.userRow}>
            <div className={m.sender_type === 1 ? styles.adminBubble : styles.userBubble}>
              <p>{m.body}</p>
            </div>
            <span className={styles.time}>
              {new Date(m.created_at).toLocaleTimeString([], {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <textarea
            className={styles.textarea}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="ここに回答を入力（送信後の削除・編集はできません）"
            rows={3}
          />
          <button type="submit" className={styles.sendBtn} disabled={isSending}>
            {isSending ? '送信中...' : '送信'}
          </button>
        </form>
      </footer>
    </div>
  );
}
