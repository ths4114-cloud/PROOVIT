export default function Loading() {
  return (
    <main className="loading-page" aria-busy="true">
      <p role="status">오늘의 도전을 불러오는 중…</p>
      <div className="skeleton" />
      <div className="skeleton short" />
      <div className="skeleton" />
    </main>
  );
}
