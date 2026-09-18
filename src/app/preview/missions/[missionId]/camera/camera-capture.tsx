'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  permission_denied:
    '카메라 권한이 꺼져 있어요. 브라우저 또는 기기 설정에서 이 사이트의 카메라 권한을 허용한 뒤 다시 시도해 주세요.',
  unsupported:
    '이 환경에서는 카메라 촬영을 지원하지 않아요. HTTPS로 연결했는지와 지원 브라우저인지 확인해 주세요.',
  device_unavailable:
    '사용할 수 있는 카메라를 찾지 못했어요. 다른 앱이 카메라를 사용 중인지 확인한 뒤 다시 시도해 주세요.',
  error: '카메라를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.',
};

const errorStatuses = new Set<CameraCaptureStatus>([
  'permission_denied',
  'unsupported',
  'device_unavailable',
  'error',
]);

function getCameraErrorStatus(error: unknown): CameraCaptureStatus {
  if (!(error instanceof DOMException)) return 'error';
  if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
    return 'permission_denied';
  }
  if (
    error.name === 'NotFoundError' ||
    error.name === 'NotReadableError' ||
    error.name === 'OverconstrainedError'
  ) {
    return 'device_unavailable';
  }
  return 'error';
}

export function CameraCapture() {
  const [status, setStatus] = useState<CameraCaptureStatus>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  async function startCamera() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      return;
    }

    stopCamera();
    setStatus('requesting_permission');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stopCamera();
        setStatus('error');
        return;
      }
      video.srcObject = stream;
      await video.play();
      if (mountedRef.current) setStatus('streaming');
    } catch (error) {
      stopCamera();
      if (mountedRef.current) setStatus(getCameraErrorStatus(error));
    }
  }

  const hasError = errorStatuses.has(status);

  return (
    <section className="space-y-4" aria-labelledby="camera-capture-title">
      <div>
        <h2 id="camera-capture-title" className="text-lg font-bold">
          카메라 인증
        </h2>
        <p
          className="mt-2 text-sm leading-7 text-muted"
          role={hasError ? 'alert' : 'status'}
          aria-live={hasError ? 'assertive' : 'polite'}
        >
          {statusMessages[status]}
        </p>
      </div>
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl border border-line bg-panel text-center text-sm leading-7 text-muted">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${status === 'streaming' ? 'block' : 'hidden'}`}
          autoPlay
          muted
          playsInline
          aria-label="카메라 촬영 화면"
        />
        {status !== 'streaming' && <span className="p-8">카메라 화면이 여기에 표시됩니다.</span>}
      </div>
      <Button
        className="w-full"
        onClick={startCamera}
        disabled={status === 'requesting_permission' || status === 'streaming'}
      >
        {status === 'requesting_permission'
          ? '권한 확인 중…'
          : hasError
            ? '카메라 다시 시도하기'
            : status === 'streaming'
              ? '카메라 준비 완료'
              : '카메라 시작하기'}
      </Button>
      <StateNotice title="Camera Proof 전용">
        사진첩이나 파일을 선택하는 대신, 이 화면에서 새 사진을 촬영합니다.
      </StateNotice>
    </section>
  );
}
