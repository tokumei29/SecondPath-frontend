import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DiaryCreatePageClient } from '@/features/dashboard/user/diaries/DiaryCreatePage';

vi.mock('@/hooks/useBodyScrollLock', () => ({
  useBodyScrollLock: () => undefined,
}));

const createDiary = vi.fn();

vi.mock('@/features/dashboard/user/diaries/api/diariesClient', () => ({
  createDiary: (...args: unknown[]) => createDiary(...args),
}));

describe('DiaryCreatePageClient', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    createDiary.mockReset();
    createDiary.mockResolvedValue({});
    vi.stubGlobal('alert', vi.fn());
  });

  it('必須の「今日の内容」が空のときは保存しない', async () => {
    const user = userEvent.setup();
    render(<DiaryCreatePageClient />);

    await user.click(screen.getByRole('button', { name: '記録を保存' }));

    expect(createDiary).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('今日の内容を入力して保存すると createDiary が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<DiaryCreatePageClient />);

    const [contentField] = screen.getAllByPlaceholderText('今日はどんな一日でしたか？');
    await user.type(contentField, 'テスト日報');
    await user.click(screen.getByRole('button', { name: '記録を保存' }));

    expect(createDiary).toHaveBeenCalledWith({
      diary: {
        content: 'テスト日報',
        good_thing: '',
        improvement: '',
        tomorrow_goal: '',
      },
    });
    expect(await screen.findByRole('heading', { name: 'ご苦労様でした！' })).toBeInTheDocument();
  });
});
