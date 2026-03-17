'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  getTextSupportDetail,
  postSupportMessage,
} from '@/features/dashboard/user/textSupport/api/textSupportClient';
import styles from './TextSupportDetailPage.module.css';

type Props = {
  params: Promise<{ id: string }>;
  initialDetail: any | null;
};

export function TextSupportDetailPageClient({ params, initialDetail }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const [detail, setDetail] = useState<any>(initialDetail);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      localStorage.setItem(`read_support_${id}`, new Date().toISOString());
    }
  }, [id]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detail?.support_messages]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const latest = await getTextSupportDetail(id);
      setDetail(latest);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await postSupportMessage(id, replyText);
      await fetchDetail();
      setReplyText('');
    } catch {
      alert('送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !detail) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          戻る
        </button>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{detail.subject || 'ご相談窓口'}</h2>
          <span className={detail.status === 'replied' ? styles.statusRead : styles.statusUnread}>
            {detail.status === 'replied' ? '回答あり' : '回答待ち'}
          </span>
        </div>
      </header>

      <div className={styles.talkArea}>
        <div className={styles.userRow}>
          <div className={styles.userBubble}>
            <div className={styles.bubbleHeader}>
              <span className={styles.subjectLabel}>件名:</span> {detail.subject || '無題の相談'}
            </div>
            <p className={styles.mainMessage}>{detail.message}</p>
          </div>
          <span className={styles.time}>{new Date(detail.created_at).toLocaleString('ja-JP')}</span>
        </div>

        {detail.support_messages?.map((msg: any) => (
          <div
            key={msg.id}
            className={msg.sender_type === 'counselor' ? styles.adminRow : styles.userRow}
          >
            <div
              className={msg.sender_type === 'counselor' ? styles.adminBubble : styles.userBubble}
            >
              <p>{msg.message}</p>
            </div>
            <span className={styles.time}>{new Date(msg.created_at).toLocaleString('ja-JP')}</span>
          </div>
        ))}
        <div ref={scrollEndRef} />
      </div>

      <footer className={styles.footer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <textarea
            className={styles.textarea}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="メッセージを入力..."
            rows={3}
            required
          />
          <button type="submit" className={styles.sendBtn} disabled={isSending}>
            {isSending ? '...' : '送信'}
          </button>
        </form>
      </footer>
    </div>
  );
}
