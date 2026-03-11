import { redirect } from 'next/navigation';

export default function Home() {
  // アクセスがあった瞬間に /login へリダイレクト
  redirect('/login');
}
