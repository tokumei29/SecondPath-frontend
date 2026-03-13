'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/api/auth';

export default function PasswordUpdatePage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await updatePassword(password);
    if (error) {
      alert('更新に失敗しました: ' + error.message);
    } else {
      alert('パスワードを更新しました。新しいパスワードでログインしてください。');
      router.push('/login');
    }
  };

  return (
    <div>
      <h2>新しいパスワードを入力</h2>
      <form onSubmit={handleUpdate}>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="新しいパスワード"
          required 
        />
        <button type="submit">パスワードを更新する</button>
      </form>
    </div>
  );
}