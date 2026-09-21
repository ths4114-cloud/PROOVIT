export default function Loading() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg items-center justify-center border-x border-line bg-background">
      <div
        aria-label="불러오는 중"
        role="status"
        className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent"
      />
    </div>
  );
}
