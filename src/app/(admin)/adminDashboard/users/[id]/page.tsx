'use client';

import { useEffect, useState, use } from 'react';
import apiClient from '@/api/client';
import { CognitiveDistortionChart } from '@/features/components/assessment/CognitiveDistortionChart';
import { ResilienceResultChart } from '@/features/components/assessment/ResilienceResultChart';
import { DiaryDetailModal } from '@/features/components/diaries/modal';
import { useBodyScrollLock } from '@/services/useBodyScrollLock';
import styles from './page.module.css';

const UserDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [selectedDiary, setSelectedDiary] = useState<any>(null);

  useBodyScrollLock(!!selectedDiary);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const res = await apiClient.get(`/admin/users/${id}/activity`);
        setData(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchUserActivity();
  }, [id]);

  if (!data) return <div className={styles.loading}>読み込み中...</div>;

  /**
   * 自己分析のタグ表示用コンポーネント
   * 空配列やundefinedの場合に「未設定」を表示するようにガード
   */
  const TagList = ({ tags }: { tags: string[] }) => {
    const activeTags = tags?.filter((t) => t && t.trim() !== '');
    if (!activeTags || activeTags.length === 0) {
      return <span className={styles.emptyLabel}>未設定</span>;
    }
    return (
      <div className={styles.tagWrapper}>
        {activeTags.map((t, i) => (
          <span key={i} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 1. プロフィール・自己分析 */}
      <section className={styles.profileSection}>
        <h2>👤 自己分析詳細</h2>
        {!data.profile ? (
          <div className={styles.card}>
            <p className={styles.noDataText}>自己分析データが登録されていません。</p>
          </div>
        ) : (
          <div className={styles.card}>
            <h3 className={styles.userNameTitle}>{data.profile.name || '名前未設定'}</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <label>短期目標</label>
                <TagList tags={data.profile.short_term_goals} />
              </div>
              <div className={styles.infoBox}>
                <label>長期目標</label>
                <TagList tags={data.profile.long_term_goals} />
              </div>
              <div className={styles.infoBox}>
                <label>強み</label>
                <TagList tags={data.profile.strengths} />
              </div>
              <div className={styles.infoBox}>
                <label>弱み</label>
                <TagList tags={data.profile.weaknesses} />
              </div>
              <div className={styles.infoBox}>
                <label>好きなこと</label>
                <TagList tags={data.profile.likes} />
              </div>
              <div className={styles.infoBox}>
                <label>趣味</label>
                <TagList tags={data.profile.hobbies} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. アセスメント・分析セクション */}
      <section className={styles.section}>
        <h2>📊 アセスメント・分析</h2>
        <div className={styles.assessmentGrid}>
          {/* PHQ-9セクション */}
          <div className={styles.phq9SimpleCard}>
            <h3>最新のPHQ-9スコア</h3>
            {data.phq9_latest ? (
              <div className={styles.scoreContainer}>
                <div className={styles.scoreDisplay}>
                  <strong>{data.phq9_latest.score}</strong>
                  <span> / 27 点</span>
                </div>
                <p className={styles.dateLabel}>実施日: {data.phq9_latest.date}</p>
              </div>
            ) : (
              <p className={styles.emptyText}>PHQ-9 未実施</p>
            )}
          </div>

          {/* チャートエリア（レジリエンス & 認知の歪み） */}
          <div className={styles.chartFlex}>
            {/* レジリエンス・レーダー */}
            <div className={styles.chartHalf}>
              <h3>職業的レジリエンス</h3>
              {data.resilience_scores ? (
                <ResilienceResultChart data={data.resilience_scores} />
              ) : (
                <div className={styles.chartEmpty}>
                  <p>レジリエンス診断 未実施</p>
                </div>
              )}
            </div>

            {/* 認知の歪み・レーダー */}
            <div className={styles.chartHalf}>
              <h3>思考の癖 (認知の歪み)</h3>
              {data.cognitive_scores ? (
                <CognitiveDistortionChart scores={data.cognitive_scores} />
              ) : (
                <div className={styles.chartEmpty}>
                  <p>思考の癖診断 未実施</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 日記セクション */}
      <section className={styles.section}>
        <h2>📓 最近の日記 (直近10件)</h2>
        <div className={styles.diaryGrid}>
          {data.diaries && data.diaries.length > 0 ? (
            data.diaries.map((d: any) => (
              <div key={d.id} className={styles.diaryCard} onClick={() => setSelectedDiary(d)}>
                <span className={styles.date}>{new Date(d.created_at).toLocaleDateString()}</span>
                <div className={styles.diaryBody}>
                  <p className={styles.diaryTruncate}>{d.content}</p>
                </div>
                <div className={styles.viewBadge}>詳細を見る</div>
              </div>
            ))
          ) : (
            <div className={styles.emptyDiaryContainer}>
              <p className={styles.emptyText}>日記の投稿履歴がありません。</p>
            </div>
          )}
        </div>
      </section>

      {/* モーダル */}
      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
};

export default UserDetailPage;
