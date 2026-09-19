import Image from 'next/image';
export function ChallengeHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-panel via-panel to-accent-deep/60 px-5 pt-6 pb-8 shadow-[0_30px_80px_-34px_rgba(255,46,126,0.55)]">
      <div className="relative z-10 max-w-[65%]">
        <p className="mb-3 font-mono text-xs font-bold tracking-[.2em] text-gold">
          ROUND 01 · 31 DAYS
        </p>
        <h1 className="text-3xl leading-tight font-black tracking-tight">
          내 아이디어를
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
        width={230}
        height={260}
        priority
        className="absolute right-[-4px] bottom-0 h-52 w-44 object-contain object-bottom"
      />
    </section>
  );
}
