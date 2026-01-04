import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth-helper';
import OnboardAdminClient from './OnboardAdminClient';

export default async function OnboardAdminPage() {
  const session = await auth();

  // Only admins can access this page
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login');
  }

  return <OnboardAdminClient />;
}

