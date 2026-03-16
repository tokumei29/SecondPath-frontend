'use client';

import { useState } from 'react';
import { TextSupportPayload } from '@/api/textSupport';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useProfile } from '@/services/useProfile';
import { useCreateTextSupport } from '@/services/useTextSupport';
import styles from './page.module.css';

const SupportPage = () => {
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { create } = useCreateTextSupport();

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useBodyScrollLock(showModal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert('相談内容は必須です');
    if (!profile?.name) return alert('ユーザー情報が読み込めていません');

    setIsSending(true);
    try {
      const payload: TextSupportPayload = {
        text_support: {
          name: profile.name, // プロフィールフックから取得した名前を使用
          email: email,
          subject: subject,
          message: content,
        },
      };

      await create(payload); // フック経由で送信（キャッシュも自動更新）

      setShowModal(true);
      setEmail('');
      setSubject('');
      setContent('');
    } catch (error) {
      alert('送信に失敗しました。');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>💬 カウンセラー相談</h1>
        <p>サービス期間中は、テキストでの相談が無料・無制限でご利用いただけます。</p>
        <p>悩みや困っていることだけでなくサービス内容のお問い合わせもこちらで承っております。</p>
        <br />
        <p>
          回答はサイドバーの<strong>「テキスト相談の回答確認」</strong>からご確認いただけます。
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>お名前（自己分析設定のお名前が自動適用されます）</label>
            <input
              type="text"
              value={isLoadingProfile ? '読み込み中...' : profile?.name || '名称取得失敗'}
              readOnly
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              placeholder="例：山田太郎"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>件名</label>
          <input
            type="text"
            required
            value={subject}
            maxLength={50}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例：仕事の進め方について"
          />
        </div>

        <div className={styles.field}>
          <label>相談内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="今の気持ちや困っていることを自由に入力してください。"
            maxLength={1000}
            rows={10}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSending || isLoadingProfile}>
          {isSending ? '送信中...' : 'カウンセラーに送信する'}
        </button>
      </form>

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="送信が完了しました"
        message={`カウンセラーにメッセージを届けました。\n\nなるべく早く回答いたします。\n回答はサイドバーの「テキスト相談の回答確認」からご確認いただけます。`}
      />
    </div>
  );
};

export default SupportPage;
