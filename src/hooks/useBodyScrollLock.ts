import { useEffect } from 'react';

// モーダルやガイド表示時に背景のスクロールをロックするカスタムフック
export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    // 確実に要素を取得
    const html = document.documentElement;
    const body = document.body;

    if (isLocked) {
      // スクロールバー消失によるガタつき防止
      const scrollBarWidth = window.innerWidth - html.clientWidth;

      // html と body 両方を固定
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.paddingRight = '';
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.paddingRight = '';
    };
  }, [isLocked]);
};
