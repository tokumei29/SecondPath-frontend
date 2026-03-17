'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DiaryDetailModal } from '@/features/dashboard/user/diaries/components/DiaryDetailModal';
import { GoalSection } from '@/features/dashboard/user/home/components/GoalSection';
import { StrengthSection } from '@/features/dashboard/user/home/components/StrengthSection';
import { Profile } from '@/features/types/profile';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './HomePage.module.css';

type Props = {
  initialProfile: Profile | null;
  initialDiaries: any[];
  initialSupports: any[];
  initialHasTodayAdvice: boolean;
};

export function HomePageClient({
  initialProfile,
  initialDiaries,
  initialSupports,
  initialHasTodayAdvice,
}: Props) {
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  useBodyScrollLock(!!selectedDiary);

  const [profile] = useState<Profile | null>(initialProfile);
  const [diaries] = useState<any[]>(initialDiaries ?? []);
  const [supports] = useState<any[]>(initialSupports ?? []);
  const [hasTodayAdvice] = useState<boolean>(initialHasTodayAdvice);

  const hasUnreadChat =
    Array.isArray(supports) &&
    supports.some((s: any) => {
      if (s.status !== 'replied') return false;
      const lastRead = localStorage.getItem(`read_support_${s.id}`);
      return !lastRead || new Date(lastRead).getTime() < new Date(s.updated_at).getTime();
    });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ja-JP');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{profile?.name || 'ユーザー'} さんのダッシュボード</h1>
        <div className={styles.subtitle}>
          おかえりなさい。最新の積み上げを確認しましょう。
          <br />
          自己分析設定の内容、日報内容が表示されます。明日への行動指針にお役立てください。
        </div>
      </header>

      {hasTodayAdvice && (
        <Link href="/counselingRecords" className={styles.adviceAlert}>
          <span className={styles.alertIcon}>📢</span>
          <div className={styles.alertContent}>
            <strong>カウンセラーからのフィードバック（支援・方針）が届いています</strong>
            <p>
              支援プログラムやアドバイスが更新されました。内容を確認しましょう。（この案内は当日中表示されます）
            </p>
          </div>
          <span className={styles.alertArrow}>&rarr;</span>
        </Link>
      )}

      {hasUnreadChat && (
        <Link href="/textSupport" className={styles.adviceAlert}>
          <span className={styles.alertIcon}>💬</span>
          <div className={styles.alertContent}>
            <strong>テキスト相談への回答が届いています</strong>
            <p>カウンセラーからチャットの返信があります。内容を確認してください。</p>
          </div>
          <span className={styles.alertArrow}>&rarr;</span>
        </Link>
      )}

      <GoalSection profile={profile} />
      <StrengthSection profile={profile} />

      <div className={styles.dashboardGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>最新の日報記録（5件）</h3>
            <span className={styles.guideText}>
              カードをタップして詳細を確認（全件はサイドバーから）
            </span>
          </div>

          <div className={styles.diaryList}>
            {diaries && diaries.length > 0 ? (
              diaries.slice(0, 5).map((diary: any) => (
                <button
                  key={diary.id}
                  className={styles.diaryEntryCard}
                  onClick={() => setSelectedDiary(diary)}
                >
                  <div className={styles.diaryTop}>
                    <span className={styles.diaryDateTag}>{formatDate(diary.created_at)}</span>
                    <span className={styles.viewBadge}>詳細を見る</span>
                  </div>
                  <div>
                    <p className={styles.diaryPreview}>
                      {diary.content.length > 60
                        ? `${diary.content.substring(0, 60)}...`
                        : diary.content}
                    </p>
                  </div>
                  <div className={styles.diaryFooter}>
                    <div className={styles.indicators}>
                      {diary.good_thing && <span title="良かったこと有">✨</span>}
                      {diary.improvement && <span title="反省点有">🤔</span>}
                      {diary.tomorrow_goal && <span title="目標有">🚀</span>}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className={styles.emptyContainer}>
                <p>まだ記録がありません。</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
}
