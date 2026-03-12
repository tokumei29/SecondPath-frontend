'use client';

import { useEffect, useState, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { getTextSupportDetail, postSupportMessage } from '@/api/textSupport';
import styles from './page.module.css';

type Message = {
  id: number;
  message: string; // content から message に統一
  sender_type: 'user' | 'counselor';
  created_at: string;
};

type SupportDetail = {
  id: number;
  subject: string;
  message: string;
  status: 'waiting' | 'replied';
  created_at: string;
  support_messages: Message[];
};

export default function TextSupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [detail, setDetail] = useState<SupportDetail | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const fetchDetail = useCallback(async () => {
    try {
      const data = await getTextSupportDetail(id);
      setDetail(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detail]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;
    setIsSending(true);
    try {
      await postSupportMessage(id, replyText);
      setReplyText('');
      await fetchDetail();
    } catch (error) {
      alert('送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  if (!detail) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
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

      {/* トークエリア */}
      <div className={styles.talkArea}>
        {/* 1. 最初の相談内容：ユーザーなので【左側(userRow)】 */}
        <div className={styles.userRow}>
          <div className={styles.userBubble}>
            {/* 件名を表示 */}
            <div className={styles.bubbleHeader}>
              <span className={styles.subjectLabel}>件名:</span> {detail.subject || '無題の相談'}
            </div>
            <p className={styles.mainMessage}>{detail.message}</p>
          </div>
          <span className={styles.time}>
            {new Date(detail.created_at).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* 2. 以降のやり取り */}
        {detail.support_messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender_type === 'counselor' ? styles.adminRow : styles.userRow}
          >
            <div
              className={msg.sender_type === 'counselor' ? styles.adminBubble : styles.userBubble}
            >
              {/* msg.content ではなく msg.message を表示 */}
              <p>{msg.message}</p>
            </div>
            <span className={styles.time}>
              {new Date(detail.created_at).toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
        <div ref={scrollEndRef} />
      </div>

      {/* 入力フッター */}
      <footer className={styles.footer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <textarea
            className={styles.textarea}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="メッセージを入力..."
            rows={1}
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
