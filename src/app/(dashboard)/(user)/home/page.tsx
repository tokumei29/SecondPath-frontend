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
import { Profile } from '@/features/types/profile';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

// --- ヘルパー: 配列を常に3要素にする（services/useProfile と同等） ---
const ensureThreeFields = (arr: string[] | null | undefined) => {
  const newArr = arr ? [...arr] : [];
  while (newArr.length < 3) newArr.push('');
  return newArr.slice(0, 3);
};

const HomePage = () => {
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  useBodyScrollLock(!!selectedDiary);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [supports, setSupports] = useState<any[]>([]);
  const [hasTodayAdvice, setHasTodayAdvice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const profileData = await getProfile();
        const normalizedProfile = profileData
          ? {
              ...profileData,
              strengths: ensureThreeFields(profileData.strengths),
              weaknesses: ensureThreeFields(profileData.weaknesses),
              likes: ensureThreeFields(profileData.likes),
              hobbies: ensureThreeFields(profileData.hobbies),
              short_term_goals: ensureThreeFields(profileData.short_term_goals),
              long_term_goals: ensureThreeFields(profileData.long_term_goals),
            }
          : null;
        setProfile(normalizedProfile);

        const diariesRes = await getDiaries();
        setDiaries(diariesRes?.data || diariesRes || []);

        const supportsRes = await getTextSupports();
        setSupports(supportsRes?.data || supportsRes || []);

        const records = await getMyRecords();
        const todayAdvice =
          Array.isArray(records) && records.length > 0
            ? (() => {
                const latestAdvice = records[0];
                const todayStr = new Date().toLocaleDateString('sv-SE');
                return latestAdvice.date.includes(todayStr);
              })()
            : false;
        setHasTodayAdvice(todayAdvice);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // 未読チャットの判定ロジック（メモ化せずともSWRの再レンダリングで最適に動作します）
  const hasUnreadChat =
    Array.isArray(supports) &&
    supports.some((s: any) => {
      if (s.status !== 'replied') return false;
      const lastRead = localStorage.getItem(`read_support_${s.id}`);
      return !lastRead || new Date(lastRead).getTime() < new Date(s.updated_at).getTime();
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* profile フックから名前を取得 */}
        <h1 className={styles.title}>{profile?.name || 'ユーザー'} さんのダッシュボード</h1>
        <div className={styles.subtitle}>
          おかえりなさい。最新の積み上げを確認しましょう。
          <br />
          自己分析設定の内容、日報内容が表示されます。明日への行動指針にお役立てください。
        </div>
      </header>

      {/* カウンセラーからのフィードバック通知（useMyRecords の hasTodayAdvice と連動） */}
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

      {/* テキスト相談の返信通知 */}
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

      {/* プロフィール情報を各セクションへ渡す */}
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
              // 最新5件を切り出して表示
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
