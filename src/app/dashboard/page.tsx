import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth-helper';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login');
  }

  return <DashboardClient />;
}

