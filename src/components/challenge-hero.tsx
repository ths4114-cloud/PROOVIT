import Image from 'next/image';
export function ChallengeHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-panel via-panel to-accent/15 px-5 pt-6 pb-8">
      <div className="relative z-10 max-w-[65%]">
        <p className="mb-3 text-xs font-bold tracking-[.2em] text-pink-400">ROUND 01 / 31 DAYS</p>
        <h1 className="text-3xl leading-tight font-black tracking-tight">
          혼자의 아이디어를
          <br />
          세상 밖으로.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          솔로프리너를 위한
          <br />
          31일 MVP 런칭 챌린지
        </p>
      </div>
      <Image
        src="/brand/fruvi.png"
        alt="챌린지 호스트 프루비"
        width={260}
        height={320}
        priority
        className="absolute right-[-28px] bottom-[-35px] -z-0 h-64 w-48 object-contain"
      />
    </section>
  );
}
