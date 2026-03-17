'use client';

import { useState } from 'react';
import { createAdminPost } from '@/features/admin/posts/api/postsClient';
import styles from './AdminPostsPage.module.css';

export function AdminPostsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.md$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') setContent(text);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setIsSubmitting(true);
    try {
      await createAdminPost({ title, content });
      alert('記事を保存しました');
      setTitle('');
      setContent('');
      setFileName('');
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('記事の保存に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>支援記事のアップロード</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>記事タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ユーザーに表示されるタイトル"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fileLabel}>
            Markdownファイルを選択
            <input
              type="file"
              accept=".md"
              onChange={handleFileChange}
              className={styles.hiddenFileInput}
            />
          </label>
          {fileName && <span className={styles.fileName}>選択中: {fileName}</span>}
        </div>

        {content && (
          <div className={styles.previewSection}>
            <label>読み込み内容の確認:</label>
            <div className={styles.rawPreview}>
              <pre>{content}</pre>
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? '保存中...' : 'この内容で記事を公開する'}
        </button>
      </form>
    </div>
  );
}
