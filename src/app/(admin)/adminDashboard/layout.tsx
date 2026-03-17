'use client';

import { AdminShell } from '@/features/admin/layout/AdminShell';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
