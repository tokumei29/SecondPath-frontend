'use client';

import { useState } from 'react';
import { CognitiveDistortionChart } from '@/features/dashboard/user/assessments/components/CognitiveDistortionChart';
import { ResilienceResultChart } from '@/features/dashboard/user/assessments/components/ResilienceResultChart';
import { DiaryDetailModal } from '@/features/dashboard/user/diaries/components/DiaryDetailModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './AdminUserDetailPage.module.css';

type Props = {
  data: any;
};

export const AdminUserDetailClient = ({ data }: Props) => {
  const [selectedDiary, setSelectedDiary] = useState<any>(null);

  useBodyScrollLock(!!selectedDiary);

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
      <section className={styles.profileSection}>
        <h2>👤 自己分析詳細</h2>
        {!data?.profile ? (
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

      <section className={styles.section}>
        <h2>📊 アセスメント・分析</h2>
        <div className={styles.assessmentGrid}>
          <div className={styles.phq9SimpleCard}>
            <h3>最新のPHQ-9スコア</h3>
            {data?.phq9_latest ? (
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

          <div className={styles.chartFlex}>
            <div className={styles.chartHalf}>
              <h3>職業的レジリエンス</h3>
              {data?.resilience_scores ? (
                <ResilienceResultChart data={data.resilience_scores} />
              ) : (
                <div className={styles.chartEmpty}>
                  <p>レジリエンス診断 未実施</p>
                </div>
              )}
            </div>

            <div className={styles.chartHalf}>
              <h3>思考の癖 (認知の歪み)</h3>
              {data?.cognitive_scores ? (
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

      <section className={styles.section}>
        <h2>📓 最近の日記 (直近10件)</h2>
        <div className={styles.diaryGrid}>
          {data?.diaries && data.diaries.length > 0 ? (
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

      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
};
