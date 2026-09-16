'use client';
import Link from 'next/link';
export default function ErrorPage() {
  return (
    <main className="error-page">
      <p className="eyebrow">LET’S TRY AGAIN</p>
      <h1>잠시 연결이 끊겼어요.</h1>
      <p>
        최신 정보를 불러오지 못했습니다.
        <br />
        연결을 확인하고 다시 시도해 주세요.
      </p>
      <button className="button primary" onClick={() => window.location.reload()}>
        다시 불러오기
      </button>
      <Link href="/" className="text-button">
        챌린지로 돌아가기
      </Link>
    </main>
  );
}
