import { notFound } from 'next/navigation';
import { DemoApp } from '@/components/demo/demo-app';

export const dynamic = 'force-dynamic';

export default async function DemoPage({ params }: { params: Promise<{ path?: string[] }> }) {
  if (process.env.ENABLE_DEMO !== 'true') notFound();
  const { path = [] } = await params;
  const route = path.join('/');
  if (
    !['', 'home', 'board', 'challenge', 'account'].includes(route) &&
    !/^missions\/day-([1-9]|[12][0-9]|3[01])(\/(camera|result))?$/.test(route)
  )
    notFound();
  return <DemoApp route={route} />;
}
