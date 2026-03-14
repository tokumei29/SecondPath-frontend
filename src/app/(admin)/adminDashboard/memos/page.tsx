'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminMemos,
  createAdminMemo,
  updateAdminMemo,
  deleteAdminMemo,
  type MemoResponse,
} from '@/api/memos';
import MemoModal from '@/features/components/admin/MemoModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

const Memos = () => {
  const [memos, setMemos] = useState<MemoResponse[]>([]);
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
      // 引数に query を渡すだけで、Rails 側の index(params[:q]) と連動します
      const data = await getAdminMemos(query);
      setMemos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  // ★ 検索実行ロジック
  useEffect(() => {
    // 1文字打つたびにAPIを叩くと重いので、入力が止まってから500ms後に実行する
    const timer = setTimeout(() => {
      fetchMemos(searchQuery);
    }, 1000);

    return () => clearTimeout(timer); // 次の文字が打たれたらタイマーをリセット
  }, [searchQuery, fetchMemos]);

  const handleOpenModal = (
    memo: MemoResponse | null = null,
    mode: 'edit' | 'view' | 'create' = 'view'
  ) => {
    setCurrentMemo(
      memo || { user_name: '', date: new Date().toISOString().split('T')[0], content: '' }
    );

    setIsEditing(mode === 'edit');
    setIsReadOnly(mode === 'view' && memo !== null); // 既存メモかつviewモード
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
      fetchMemos();
    } catch (error) {
      alert('保存に失敗しました。');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 行のクリックイベント発火を防ぐ
    if (!confirm('削除しますか？')) return;
    try {
      await deleteAdminMemo(id);
      fetchMemos();
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
                  {/* 編集ボタン：e.stopPropagation() を追加して親の view モード発火を防ぐ */}
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
};

export default Memos;
