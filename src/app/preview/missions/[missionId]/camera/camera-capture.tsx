'use client';

import { useState } from 'react';
import { Button, StateNotice } from '@/components/ui';

export type CameraCaptureStatus =
  | 'idle'
  | 'requesting_permission'
  | 'streaming'
  | 'captured'
  | 'permission_denied'
  | 'unsupported'
  | 'device_unavailable'
  | 'error';

const statusMessages: Record<CameraCaptureStatus, string> = {
  idle: '카메라를 시작하면 이 화면에서만 새 인증 사진을 촬영할 수 있어요.',
  requesting_permission: '브라우저의 카메라 권한 응답을 기다리고 있어요.',
  streaming: '결과물이 잘 보이도록 화면 안에 맞춰주세요.',
  captured: '촬영한 사진을 확인해 주세요.',
  permission_denied: '카메라 권한이 꺼져 있어요.',
  unsupported: '이 브라우저에서는 카메라 촬영을 지원하지 않아요.',
  device_unavailable: '사용할 수 있는 카메라를 찾지 못했어요.',
  error: '카메라를 시작하지 못했어요.',
};

export function CameraCapture() {
  const [status] = useState<CameraCaptureStatus>('idle');

  return (
    <section className="space-y-4" aria-labelledby="camera-capture-title">
      <div>
        <h2 id="camera-capture-title" className="text-lg font-bold">
          카메라 인증
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted" aria-live="polite">
          {statusMessages[status]}
        </p>
      </div>
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-line bg-panel p-8 text-center text-sm leading-7 text-muted">
        카메라 화면이 여기에 표시됩니다.
      </div>
      <Button disabled className="w-full">
        카메라 연결 준비 중
      </Button>
      <StateNotice title="Camera Proof 전용">
        사진첩이나 파일을 선택하는 대신, 이 화면에서 새 사진을 촬영합니다.
      </StateNotice>
    </section>
  );
}
