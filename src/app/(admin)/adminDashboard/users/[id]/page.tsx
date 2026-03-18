import { AdminUserDetailPage } from '@/features/admin/users/detail/AdminUserDetailPage';

// 1. 引数の型を Promise<{ id: string }> に変更
export default function AdminUserDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  // 2. そのまま AdminUserDetailPage へ渡す
  // (受け取り側の AdminUserDetailPage でも Props の型を Promise に合わせる必要があります)
  return <AdminUserDetailPage params={params} />;
}