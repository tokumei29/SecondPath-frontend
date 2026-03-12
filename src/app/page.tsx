import { redirect } from 'next/navigation';

const Home = () => {
  // アクセスがあった瞬間に /login へリダイレクト
  redirect('/login');
};

export default Home;
