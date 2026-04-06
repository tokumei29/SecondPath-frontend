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
import { formatJapanLocaleDate, toJapanCalendarDateString } from '@/lib/utils';
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
      memo || {
        user_name: '',
        date: toJapanCalendarDateString(new Date().toISOString()),
        content: '',
      }
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
    const prevMemos = memos;
    try {
      if (isEditing && currentMemo.id) {
        // 楽観的にローカル一覧を更新
        setMemos((prev) =>
          prev.map((m) => (m.id === currentMemo.id ? { ...m, ...payload.memo } : m))
        );
        await updateAdminMemo(currentMemo.id, payload);
      } else {
        // 一時IDを付けて楽観的に追加
        const tempId = `temp-${Date.now()}`;
        const optimistic = {
          id: tempId,
          created_at: currentMemo.date,
          updated_at: currentMemo.date,
          ...payload.memo,
        } as MemoResponse;
        setMemos((prev) => [optimistic, ...prev]);

        const created = await createAdminMemo(payload);
        // 実IDで置き換え
        setMemos((prev) => prev.map((m) => (m.id === tempId ? created : m)));
      }
      setIsModalOpen(false);
      // 裏で最新を同期（失敗しても UI は保ったまま）
      fetchMemos(searchQuery);
    } catch (error) {
      alert('保存に失敗しました。');
      setMemos(prevMemos);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('削除しますか？')) return;
    const prevMemos = memos;
    try {
      // 楽観的に削除
      setMemos((prev) => prev.filter((m) => m.id !== id));
      await deleteAdminMemo(id);
      // 裏で同期
      fetchMemos(searchQuery);
    } catch (error) {
      alert('失敗しました。');
      // 元に戻す
      setMemos(prevMemos);
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
                <td className={styles.td}>{formatJapanLocaleDate(memo.date)}</td>
                <td className={`${styles.td} ${styles.userName}`}>{memo.user_name}</td>
                <td className={`${styles.td} ${styles.contentSummary}`}>{memo.content}</td>
                <td className={`${styles.td} ${styles.actions}`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(memo, 'edit');
                    }}
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, memo.id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  >
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
