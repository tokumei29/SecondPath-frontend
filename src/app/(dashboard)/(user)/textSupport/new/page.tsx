'use client';

import { useState } from 'react';
import { createTextSupport, TextSupportPayload } from '@/api/textSupport';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import styles from './page.module.css';

const SupportPage = () => {
  const [name, setName] = useState(''); // 名前
  const [email, setEmail] = useState(''); // メアド
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert('相談内容は必須です');

    setIsSending(true);
    try {
      // 型安全なペイロードを作成
      const payload: TextSupportPayload = {
        text_support: {
          name: name || '匿名希望',
          email: email,
          subject: subject || '無題の相談',
          message: content,
        },
      };

      await createTextSupport(payload);

      setShowModal(true);
      setName('');
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
            <label>お名前（カウンセリング時のお名前を入力してください）</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="例：山田太郎"
            />
          </div>
          {/* <div className={styles.field}>
            <label>メールアドレス（記載は任意です）</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </div> */}
        </div>

        <div className={styles.field}>
          <label>件名（任意）</label>
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

        <button type="submit" className={styles.submitBtn} disabled={isSending}>
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
