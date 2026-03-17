'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createAdminMemo,
  deleteAdminMemo,
  getAdminMemos,
  type MemoResponse,
  updateAdminMemo,
} from '@/features/admin/memos/api/memosClient';
import MemoModal from '@/features/admin/memos/components/MemoModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './AdminMemosPage.module.css';

export function AdminMemosPageClient({ initialMemos }: { initialMemos: MemoResponse[] }) {
  const [memos, setMemos] = useState<MemoResponse[]>(initialMemos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemo, setCurrentMemo] = useState<Partial<MemoResponse> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useBodyScrollLock(isModalOpen);

  const fetchMemos = useCallback(async (query?: string) => {
    setIsLoading(true);
    try {
      const data = await getAdminMemos(query);
      setMemos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // SSRで初期表示しつつ、クライアント側でも最新化
  useEffect(() => {
    fetchMemos().catch(() => undefined);
  }, [fetchMemos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMemos(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchMemos]);

  const handleOpenModal = (
    memo: MemoResponse | null = null,
    mode: 'edit' | 'view' | 'create' = 'view'
  ) => {
    setCurrentMemo(
      memo || { user_name: '', date: new Date().toISOString().split('T')[0], content: '' }
    );
    setIsEditing(mode === 'edit');
    setIsReadOnly(mode === 'view' && memo !== null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentMemo?.user_name || !currentMemo?.content || !currentMemo?.date) {
      return alert('全ての項目を入力してください');
    }
    const payload = {
      memo: {
        user_name: currentMemo.user_name,
        date: currentMemo.date,
        content: currentMemo.content,
      },
    };
    try {
      if (isEditing && currentMemo.id) {
        await updateAdminMemo(currentMemo.id, payload);
      } else {
        await createAdminMemo(payload);
      }
      setIsModalOpen(false);
      fetchMemos(searchQuery);
    } catch (error) {
      alert('保存に失敗しました。');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('削除しますか？')) return;
    try {
      await deleteAdminMemo(id);
      fetchMemos(searchQuery);
    } catch (error) {
      alert('失敗しました。');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          📋 カウンセリング記録管理
          {isLoading && <span className={styles.loadingText}>読み込み中...</span>}
        </h1>
        <button onClick={() => handleOpenModal()} className={styles.createButton}>
          + 新規記録作成
        </button>
      </header>

      <div className={styles.description}>
        <p>
          ユーザーに公開されない記録を管理します。カウンセリング後のメモ用などにご利用ください。
        </p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="相談者の名前で検索..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>日付</th>
              <th className={styles.th}>相談者名</th>
              <th className={styles.th}>内容抜粋</th>
              <th className={`${styles.th} ${styles.actions}`}>操作</th>
            </tr>
          </thead>
          <tbody>
            {memos.map((memo) => (
              <tr key={memo.id} className={styles.tr} onClick={() => handleOpenModal(memo, 'view')}>
                <td className={styles.td}>{memo.date}</td>
                <td className={`${styles.td} ${styles.userName}`}>{memo.user_name}</td>
                <td className={`${styles.td} ${styles.contentSummary}`}>{memo.content}</td>
                <td className={`${styles.td} ${styles.actions}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(memo, 'edit');
                    }}
                    className={styles.editLink}
                  >
                    編集
                  </button>
                  <button onClick={(e) => handleDelete(e, memo.id)} className={styles.deleteLink}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && memos.length === 0 && (
          <div className={styles.emptyMessage}>
            {searchQuery ? `「${searchQuery}」に一致する記録はありません。` : '記録がありません。'}
          </div>
        )}
      </div>

      <MemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentMemo={currentMemo}
        setCurrentMemo={setCurrentMemo}
        isEditing={isEditing}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
