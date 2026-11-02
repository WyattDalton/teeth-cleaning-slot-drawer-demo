import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type StaffButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'glass';

export function staffButtonClassName(options: {
  variant?: StaffButtonVariant;
  className?: string;
  busy?: boolean;
}): string {
  const variant = options.variant ?? 'primary';
  const parts = ['staff-btn'];
  if (variant === 'secondary') parts.push('staff-btn--secondary');
  if (variant === 'ghost') parts.push('staff-btn--ghost');
  if (variant === 'destructive') parts.push('staff-btn--destructive');
  if (variant === 'glass') parts.push('staff-btn--glass');
  if (options.busy) parts.push('staff-btn--busy');
  if (options.className) parts.push(options.className);
  return parts.join(' ');
}

type StaffButtonProps = {
  children: ReactNode;
  variant?: StaffButtonVariant;
  className?: string;
  busy?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function StaffButton({
  children,
  variant,
  className,
  type,
  busy,
  disabled,
  ...rest
}: StaffButtonProps) {
  const classes = staffButtonClassName({ variant, className, busy });
  return (
    <button
      type={type ?? 'button'}
      className={classes}
      disabled={Boolean(disabled || busy)}
      aria-busy={busy ? true : undefined}
      {...rest}
    >
      <span className="inline-flex items-center gap-2">
        {busy ? <Loader2 className="staff-btn__spinner h-4 w-4 shrink-0" aria-hidden /> : null}
        {children}
      </span>
    </button>
  );
}
