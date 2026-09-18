import Link from 'next/link';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
export const buttonClass =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45';
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
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-line bg-panel p-5 ${className}`}>
      {children}
    </section>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-accent/45 bg-accent/10 px-3 py-1 text-xs font-semibold text-pink-300">
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
        <p id={`${id}-error`} className="text-sm text-pink-300">
          {error}
        </p>
      )}
    </div>
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
