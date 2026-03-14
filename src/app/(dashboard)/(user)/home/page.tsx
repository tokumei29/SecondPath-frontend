'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDiaries } from '@/api/diaries';
import { getProfile } from '@/api/profile';
import { getTextSupports } from '@/api/textSupport';
import { getMyRecords } from '@/api/userRecords';
import { DiaryDetailModal } from '@/features/components/diaries/modal';
import { GoalSection } from '@/features/components/home/goalSection';
import { StrengthSection } from '@/features/components/home/strengthSection';
import { ProfileResponse } from '@/features/types/profile';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

export type Diary = {
  id: number;
  content: string;
  good_thing: string;
  improvement: string;
  tomorrow_goal: string;
  created_at: string;
};

const HomePage = () => {
  const [userName, setUserName] = useState<string>('');
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [hasTodayAdvice, setHasTodayAdvice] = useState(false);
  const [hasUnreadChat, setHasUnreadChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useBodyScrollLock(!!selectedDiary);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      try {
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
          setUserName(profileData.name || 'ユーザー');
        }

        const diaryRes = await getDiaries();
        const diaryList = diaryRes.data || diaryRes;

        if (Array.isArray(diaryList)) {
          setDiaries(diaryList.slice(0, 5)); // 最新5件を表示

          const adviceRes = await getMyRecords();
          if (Array.isArray(adviceRes) && adviceRes.length > 0) {
            const latestAdvice = adviceRes[0]; // 最新の1件

            // 今日の日付を YYYY-MM-DD 形式で取得
            const todayStr = new Date().toLocaleDateString('sv-SE'); // sv-SE は YYYY-MM-DD になる

            // アドバイスの日付(latestAdvice.date)が今日ならフラグを立てる
            if (latestAdvice.date.includes(todayStr)) {
              setHasTodayAdvice(true);
            }
          }

          const supports = await getTextSupports();
          const unreadExists =
            Array.isArray(supports) &&
            supports.some((s: any) => {
              if (s.status !== 'replied') return false;
              const lastRead = localStorage.getItem(`read_support_${s.id}`);
              // 記録がない、または更新日時が既読日時より新しい場合に未読とする
              return !lastRead || new Date(lastRead).getTime() < new Date(s.updated_at).getTime();
            });
          setHasUnreadChat(unreadExists);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{userName} さんのダッシュボード</h1>
        <div className={styles.subtitle}>
          おかえりなさい。最新の積み上げを確認しましょう。
          <br />
          自己分析設定の内容、日報内容が表示されます。自己分析・明日への行動指針にお役立てください。
        </div>
      </header>

      {/* ★ カウンセラーからのアドバイス通知アラート */}
      {hasTodayAdvice && (
        <Link href="/counselingRecords" className={styles.adviceAlert}>
          <span className={styles.alertIcon}>📢</span>
          <div className={styles.alertContent}>
            <strong>カウンセラーからのアドバイス（支援・方針）が届いています</strong>
            <p>
              支援プログラムやアドバイスが更新されました。内容を確認しましょう。（アドバイスのあった当日中この案内は表示されます）
            </p>
          </div>
          <span className={styles.alertArrow}>&rarr;</span>
        </Link>
      )}

      {/* ★ テキスト相談の返信通知（未読がある時ずっと表示） ★ 追加 */}
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
        {/* <section className={styles.card}>
          <h3 className={styles.cardTitle}>累計記録数</h3>
          <p className={styles.statNumber}>
            {diaries.length} <span className={styles.unit}>件</span>
          </p>
        </section> */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>最新の日報記録（5件）</h3>
            <span className={styles.guideText}>
              カードをタップして詳細を確認（全件はサイドバーから）
            </span>
          </div>

          <div className={styles.diaryList}>
            {diaries.length > 0 ? (
              diaries.map((diary) => (
                <button
                  key={diary.id}
                  className={styles.diaryEntryCard}
                  onClick={() => setSelectedDiary(diary)}
                >
                  <div className={styles.diaryTop}>
                    <span className={styles.diaryDateTag}>{formatDate(diary.created_at)}</span>
                    <span className={styles.viewBadge}>詳細を見る</span>
                  </div>
                  <div className={styles.diaryBody}>
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
                <p className={styles.emptyText}>まだ記録がありません。</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
};

export default HomePage;
