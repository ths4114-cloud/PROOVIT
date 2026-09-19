import Link from 'next/link';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
export const buttonClass =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(255,46,126,0.85)] transition hover:bg-accent-hover hover:shadow-[0_14px_32px_-8px_rgba(255,46,126,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none';
export function Button({
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`${buttonClass} ${className}`} {...props} />;
}
export function ActionLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonClass} ${className}`}>
      {children}
    </Link>
  );
}
export function Card({
  children,
  className = '',
  tone = 'dark',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'dark' | 'cream';
}) {
  if (tone === 'cream') {
    return (
      <section
        className={`rounded-3xl border border-cream/60 bg-cream p-5 text-[#2a1e1c] ${className}`}
      >
        {children}
      </section>
    );
  }
  return (
    <section
      className={`rounded-3xl border border-line bg-panel p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/45 bg-accent/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide whitespace-nowrap text-accent">
      {children}
    </span>
  );
}
export function Field({
  label,
  id,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-12 w-full rounded-xl border border-line bg-background px-4 outline-none focus:border-accent"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
export function MonoStat({
  value,
  suffix,
  tone = 'default',
}: {
  value: ReactNode;
  suffix?: string;
  tone?: 'default' | 'gold';
}) {
  return (
    <p className="font-mono text-2xl font-bold">
      <span className={tone === 'gold' ? 'text-gold' : 'text-accent'}>{value}</span>
      {suffix && <span className="ml-1 font-sans text-sm font-normal text-muted">{suffix}</span>}
    </p>
  );
}
export function StateNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="font-bold">{title}</h2>
      <div className="mt-2 text-sm leading-7 text-muted">{children}</div>
    </Card>
  );
}
