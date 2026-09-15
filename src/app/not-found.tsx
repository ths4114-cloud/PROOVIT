import { AppShell } from '@/components/app-shell';
import { ActionLink, StateNotice } from '@/components/ui';
export default function NotFound() {
  return (
    <AppShell>
      <StateNotice title="페이지를 찾을 수 없어요">주소를 확인하고 다시 시도해주세요.</StateNotice>
      <ActionLink href="/">처음으로</ActionLink>
    </AppShell>
  );
}
