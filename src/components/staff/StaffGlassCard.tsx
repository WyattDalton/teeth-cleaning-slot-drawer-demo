import { cn } from '../../lib/cn';
import { getStaffGlassCardStyle, type StaffGlassCardSeed } from '../../lib/glassCardStyle';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type StaffGlassCardProps<T extends ElementType> = {
  as?: T;
  seed?: StaffGlassCardSeed;
  interactive?: boolean;
  variant?: 'default' | 'pill' | 'icon' | 'featured' | 'panel';
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function StaffGlassCard<T extends ElementType = 'div'>({
  as,
  seed,
  interactive = false,
  variant = 'default',
  className,
  style,
  ...props
}: StaffGlassCardProps<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(
        'staff-glass-card',
        interactive && 'staff-glass-card--interactive',
        variant === 'pill' && 'staff-glass-card--pill',
        variant === 'icon' && 'staff-glass-card--icon',
        variant === 'featured' && 'staff-glass-card--featured',
        variant === 'panel' && 'staff-glass-card--panel',
        className,
      )}
      style={{ ...getStaffGlassCardStyle(seed), ...style }}
      {...props}
    />
  );
}
