'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getInquiryDetail, postReply } from '@/api/textSupport';
import styles from './page.module.css';

export default function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // トーク履歴の読み込み
  const loadData = useCallback(async () => {
    try {
      const res = await getInquiryDetail(id);
      setData(res);
    } catch (err) {
      console.error('取得失敗:', err);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 回答（トーク）の送信
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await postReply(id, replyText);
      setReplyText(''); // 入力欄をクリア
      await loadData(); // 履歴を最新にする
    } catch (err) {
      alert('送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  if (!data) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      {/* 上部ヘッダー */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <span>←</span> 戻る
        </button>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{data.support.name || '匿名'} さんの相談室</h2>
          <span className={data.support.status === 0 ? styles.statusUnread : styles.statusRead}>
            {data.support.status === 0 ? '未対応' : '対応済み'}
          </span>
        </div>
      </header>

      {/* LINE風トークエリア */}
      <div className={styles.talkArea}>
        {/* 最初のお問い合わせ内容 */}
        <div className={styles.userRow}>
          <div className={styles.userBubble}>
            <div className={styles.bubbleHeader}>件名: {data.support.subject}</div>
            <p>{data.support.message}</p>
          </div>
          <span className={styles.time}>{new Date(data.support.created_at).toLocaleString()}</span>
        </div>

        {/* 以降のやり取り履歴 */}
        {data.messages.map((m: any) => (
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

      {/* 回答入力フッター */}
      <footer className={styles.footer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <textarea
            className={styles.textarea}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="ここに回答を入力（送信後の削除・編集はできません）"
            rows={2}
          />
          <button type="submit" className={styles.sendBtn} disabled={isSending}>
            {isSending ? '送信中...' : '送信'}
          </button>
        </form>
      </footer>
    </div>
  );
}
