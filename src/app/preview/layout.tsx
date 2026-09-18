import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
export const dynamic = 'force-dynamic';
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.ENABLE_UI_PREVIEW !== 'true') notFound();
  return <AppShell preview>{children}</AppShell>;
}
