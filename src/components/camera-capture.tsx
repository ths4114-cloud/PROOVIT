'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, StateNotice } from '@/components/ui';

export type CameraCaptureStatus =
  | 'idle'
  | 'requesting_permission'
  | 'streaming'
  | 'capturing'
  | 'captured'
  | 'permission_denied'
  | 'unsupported'
  | 'device_unavailable'
  | 'error';

const statusMessages: Record<CameraCaptureStatus, string> = {
  idle: '카메라를 시작하면 이 화면에서만 새 인증 사진을 촬영할 수 있어요.',
  requesting_permission: '브라우저의 카메라 권한 응답을 기다리고 있어요.',
  streaming: '결과물이 잘 보이도록 화면 안에 맞춰주세요.',
  capturing: '촬영한 사진을 준비하고 있어요.',
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

export function CameraCapture({ missionId }: { missionId?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const photoRef = useRef<Blob | null>(null);
  const keyRef = useRef<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<CameraCaptureStatus>('idle');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturedUrlRef = useRef<string | null>(null);
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
      requestRef.current?.abort();
      photoRef.current = null;
      stopCamera();
      if (capturedUrlRef.current) URL.revokeObjectURL(capturedUrlRef.current);
    };
  }, [stopCamera]);

  function clearCapturedPhoto() {
    photoRef.current = null;
    keyRef.current = null;
    setSubmissionError('');
    if (capturedUrlRef.current) URL.revokeObjectURL(capturedUrlRef.current);
    capturedUrlRef.current = null;
    setCapturedUrl(null);
  }

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
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(() => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            reject(new Error('Camera metadata timed out.'));
          }, 5000);
          function handleLoadedMetadata() {
            window.clearTimeout(timeout);
            resolve();
          }
          video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        });
      }
      if (mountedRef.current) setStatus('streaming');
    } catch (error) {
      stopCamera();
      if (mountedRef.current) setStatus(getCameraErrorStatus(error));
    }
  }

  async function capturePhoto() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      stopCamera();
      setStatus('error');
      return;
    }

    setStatus('capturing');
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas context is unavailable.');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });
      if (!blob) throw new Error('Photo encoding failed.');
      if (!mountedRef.current) return;

      clearCapturedPhoto();
      photoRef.current = blob;
      const url = URL.createObjectURL(blob);
      capturedUrlRef.current = url;
      setCapturedUrl(url);
      stopCamera();
      setStatus('captured');
    } catch {
      stopCamera();
      if (mountedRef.current) setStatus('error');
    }
  }

  async function retakePhoto() {
    clearCapturedPhoto();
    await startCamera();
  }

  async function submitPhoto() {
    if (!missionId || !photoRef.current || requestRef.current) return;
    if (photoRef.current.size > 4 * 1024 * 1024) {
      setSubmissionError('사진이 너무 큽니다. 다시 촬영해 주세요.');
      return;
    }
    keyRef.current ??= crypto.randomUUID();
    const controller = new AbortController();
    requestRef.current = controller;
    setSubmitting(true);
    setSubmissionError('');
    const timeout = window.setTimeout(() => controller.abort(), 90000);
    try {
      const response = await fetch(`/api/missions/${missionId}/proofs`, {
        method: 'POST',
        body: photoRef.current,
        headers: { 'Content-Type': 'image/jpeg', 'Idempotency-Key': keyRef.current },
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        const code = result.error?.code;
        if (code === 'RETRY_REQUIRED' || code === 'INVALID_IMAGE') keyRef.current = null;
        const messages: Record<string, string> = {
          PROCESSING: '사진을 처리 중이에요. 잠시 후 제출을 다시 눌러 결과를 확인해 주세요.',
          RETRY_REQUIRED: '저장하지 못했어요. 같은 사진으로 다시 제출해 주세요.',
          RATE_LIMIT: '요청이 많아요. 1분 후 다시 시도해 주세요.',
          INVALID_IMAGE: '사진을 읽지 못했어요. 다시 촬영해 주세요.',
          NOT_READY: '현재 제출할 수 없는 미션이에요. 미션보드에서 상태를 확인해 주세요.',
          UNAUTHENTICATED: '로그인이 만료됐어요. 다시 로그인한 뒤 진행해 주세요.',
        };
        throw new Error(messages[code] ?? '제출을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
      if (mountedRef.current) {
        clearCapturedPhoto();
        router.replace(`/missions/${missionId}/result`);
        router.refresh();
      }
    } catch (error) {
      if (mountedRef.current)
        setSubmissionError(
          error instanceof Error && error.name !== 'AbortError'
            ? error.message
            : '응답이 늦어지고 있어요. 다시 제출하면 기존 처리 결과를 확인합니다.',
        );
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      if (mountedRef.current) setSubmitting(false);
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
        {status === 'captured' && capturedUrl && (
          <Image
            src={capturedUrl}
            alt="촬영한 인증 사진 미리보기"
            fill
            unoptimized
            className="object-contain"
          />
        )}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${status === 'streaming' || status === 'capturing' ? 'block' : 'hidden'}`}
          autoPlay
          muted
          playsInline
          aria-label="카메라 촬영 화면"
        />
        {status !== 'streaming' && status !== 'capturing' && status !== 'captured' && (
          <span className="p-8">카메라 화면이 여기에 표시됩니다.</span>
        )}
      </div>
      {status === 'streaming' ? (
        <Button className="w-full" onClick={capturePhoto}>
          사진 촬영하기
        </Button>
      ) : status === 'capturing' ? (
        <Button className="w-full" disabled>
          사진 준비 중…
        </Button>
      ) : status === 'captured' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button className="w-full !bg-panel" onClick={retakePhoto} disabled={submitting}>
            다시 촬영하기
          </Button>
          <Button className="w-full" disabled={!missionId || submitting} onClick={submitPhoto}>
            {!missionId ? '제출 기능 연결 전' : submitting ? '제출 중…' : '인증 사진 제출하기'}
          </Button>
        </div>
      ) : (
        <Button
          className="w-full"
          onClick={startCamera}
          disabled={status === 'requesting_permission'}
        >
          {status === 'requesting_permission'
            ? '권한 확인 중…'
            : hasError
              ? '카메라 다시 시도하기'
              : '카메라 시작하기'}
        </Button>
      )}
      {submitting && <p role="status">사진을 안전하게 저장하고 있어요. 잠시 기다려 주세요.</p>}
      {submissionError && (
        <p role="alert" className="text-sm text-accent">
          {submissionError}
        </p>
      )}
      <StateNotice title="Camera Proof 전용">
        사진첩이나 파일을 선택하는 대신, 이 화면에서 새 사진을 촬영합니다.
      </StateNotice>
    </section>
  );
}
