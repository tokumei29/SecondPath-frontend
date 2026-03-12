'use client';

import { useEffect, useState, use } from 'react';
import apiClient from '@/api/client';
import { CognitiveDistortionChart } from '@/features/components/assessment/CognitiveDistortionChart';
import { ResilienceResultChart } from '@/features/components/assessment/ResilienceResultChart';
import { DiaryDetailModal } from '@/features/components/diaries/modal';
import styles from './page.module.css';

const UserDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [selectedDiary, setSelectedDiary] = useState<any>(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const res = await apiClient.get(`/admin/users/${id}/activity`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserActivity();
  }, [id]);

  if (!data) return <div className={styles.loading}>読み込み中...</div>;

  // 自己分析のタグ表示用コンポーネント
  const TagList = ({ tags }: { tags: string[] }) => (
    <div className={styles.tagWrapper}>
      {tags
        ?.filter((t) => t !== '')
        .map((t, i) => (
          <span key={i} className={styles.tag}>
            {t}
          </span>
        )) || <span className={styles.empty}>未設定</span>}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 1. プロフィール・自己分析（タグ形式で綺麗に） */}
      <section className={styles.profileSection}>
        <h2>👤 自己分析詳細</h2>
        <div className={styles.card}>
          <h3 className={styles.userNameTitle}>{data.profile?.name}</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <label>短期目標</label>
              <TagList tags={data.profile?.short_term_goals} />
            </div>
            <div className={styles.infoBox}>
              <label>長期目標</label>
              <TagList tags={data.profile?.long_term_goals} />
            </div>
            <div className={styles.infoBox}>
              <label>強み</label>
              <TagList tags={data.profile?.strengths} />
            </div>
            <div className={styles.infoBox}>
              <label>弱み</label>
              <TagList tags={data.profile?.weaknesses} />
            </div>
            <div className={styles.infoBox}>
              <label>好きなこと</label>
              <TagList tags={data.profile?.likes} />
            </div>
            <div className={styles.infoBox}>
              <label>趣味</label>
              <TagList tags={data.profile?.hobbies} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. アセスメント（グラフを並べる） */}
      <section className={styles.section}>
        <h2>📊 アセスメント・分析</h2>
        <div className={styles.assessmentGrid}>
          {/* PHQ-9 推移グラフ */}
          {data.phq9_latest ? (
            <div className={styles.phq9SimpleCard}>
              <h3>最新のPHQ-9スコア</h3>
              <div className={styles.scoreDisplay}>
                <strong>{data.phq9_latest.score}</strong>
                <span> / 27 点</span>
              </div>
              <p className={styles.dateLabel}>実施日: {data.phq9_latest.date}</p>
            </div>
          ) : (
            <div className={styles.phq9SimpleCard}>
              <p>PHQ-9未実施</p>
            </div>
          )}

          <div className={styles.chartFlex}>
            {/* レジリエンス・レーダー */}
            {data.resilience_scores && (
              <div className={styles.chartHalf}>
                <ResilienceResultChart data={data.resilience_scores} />
              </div>
            )}
            {/* 認知の歪み・レーダー */}
            {data.cognitive_scores && (
              <div className={styles.chartHalf}>
                <CognitiveDistortionChart scores={data.cognitive_scores} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. 日記セクション（直近10件・クリックでモーダル） */}
      <section className={styles.section}>
        <h2>📓 最近の日記 (直近10件)</h2>
        <div className={styles.diaryGrid}>
          {data.diaries.map((d: any) => (
            <div key={d.id} className={styles.diaryCard} onClick={() => setSelectedDiary(d)}>
              <span className={styles.date}>{new Date(d.created_at).toLocaleDateString()}</span>
              <p className={styles.diaryTruncate}>{d.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* モーダル */}
      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
};

export default UserDetailPage;
