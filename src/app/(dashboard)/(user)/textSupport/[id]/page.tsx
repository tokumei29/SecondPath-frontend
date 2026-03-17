'use client';

import { useState, useRef, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTextSupportDetail, postSupportMessage } from '@/api/textSupport';
import styles from './page.module.css';

const TextSupportDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const [detail, setDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await getTextSupportDetail(id);
      setDetail(res?.data || res || null);
    } catch (e) {
      console.error(e);
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 既読処理（コンポーネント読み込み時に実行）
  useEffect(() => {
    if (id) {
      localStorage.setItem(`read_support_${id}`, new Date().toISOString());
    }
  }, [id]);

  // メッセージが更新されたら下までスクロール
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detail?.support_messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await postSupportMessage(id, replyText);
      await fetchDetail();
      setReplyText('');
    } catch (error) {
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
        {/* 初回の相談内容 */}
        <div className={styles.userRow}>
          <div className={styles.userBubble}>
            <div className={styles.bubbleHeader}>
              <span className={styles.subjectLabel}>件名:</span> {detail.subject || '無題の相談'}
            </div>
            <p className={styles.mainMessage}>{detail.message}</p>
          </div>
          <span className={styles.time}>{new Date(detail.created_at).toLocaleString('ja-JP')}</span>
        </div>

        {/* トーク履歴 */}
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
};

export default TextSupportDetailPage;
