/**
 * Portaled staff right-hand drawer (demo slim — no copilot / app context).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '../icons';
import { StaffButton } from './StaffButton';
import { drawerPanelMotion, drawerScrimMotion } from '../../lib/staffMotion';

export function StaffDrawer({
  open,
  title,
  ariaLabel,
  onClose,
  children,
  nested = false,
  nestedDepth = 1,
  footer,
  wide = false,
  headerExtraSlot = false,
  headerActions,
  snappy = false,
}: {
  open: boolean;
  title?: string;
  ariaLabel?: string;
  onClose: () => void;
  children: ReactNode;
  nested?: boolean;
  nestedDepth?: 1 | 2;
  footer?: ReactNode;
  wide?: boolean;
  headerExtraSlot?: boolean;
  headerActions?: ReactNode;
  snappy?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (!nested && document.querySelector('.staff-nested-drawer-root')) return;
      if (nested && nestedDepth < 2 && document.querySelector('.staff-nested-drawer-root--depth-2')) {
        return;
      }
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, nested, nestedDepth]);

  if (!mounted) return null;

  const dialogLabel = (ariaLabel || title || 'Drawer').trim() || 'Drawer';
  const depth = nested ? nestedDepth : 1;
  const scrimMotion = drawerScrimMotion();
  const panelMotion = drawerPanelMotion(undefined, snappy);

  const rootClassName = [
    nested ? 'staff-nested-drawer-root' : 'staff-drawer-root',
    nested && depth >= 2 ? 'staff-nested-drawer-root--depth-2' : '',
    'fixed inset-0',
  ]
    .filter(Boolean)
    .join(' ');

  const panelClassName = [
    nested ? 'staff-nested-drawer-panel' : 'staff-drawer-panel',
    wide ? 'staff-drawer-panel--wide' : '',
    'absolute right-0 top-0 flex h-full min-h-0 flex-col gap-4 overflow-hidden border-l border-[var(--kahoots-border)] bg-[var(--kahoots-cream)] p-6 shadow-lg',
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="staff-drawer"
          className={rootClassName}
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          data-nested-depth={nested ? depth : undefined}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {nested ? (
            <>
              <motion.button
                type="button"
                className="staff-nested-drawer-scrim"
                aria-label={`Close ${dialogLabel}`}
                onClick={onClose}
                initial={scrimMotion.initial}
                animate={scrimMotion.animate}
                exit={scrimMotion.exit}
                transition={scrimMotion.transition}
              />
              <button
                type="button"
                className="staff-nested-drawer-peek"
                aria-label="Show parent drawer"
                onClick={onClose}
              />
            </>
          ) : (
            <motion.button
              type="button"
              className="staff-drawer-scrim"
              aria-label={`Close ${dialogLabel}`}
              onClick={onClose}
              initial={scrimMotion.initial}
              animate={scrimMotion.animate}
              exit={scrimMotion.exit}
              transition={scrimMotion.transition}
            />
          )}
          <motion.div
            className={panelClassName}
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={'transition' in panelMotion ? panelMotion.transition : undefined}
          >
            <div className="flex shrink-0 items-center justify-between gap-2">
              {title ? <h2 className="staff-display min-w-0 flex-1 text-2xl">{title}</h2> : null}
              <div className="staff-drawer-header-actions ml-auto">
                {headerActions}
                {headerExtraSlot ? (
                  <div
                    data-staff-drawer-header-extra
                    className="flex min-w-0 flex-wrap items-center justify-end gap-2"
                  />
                ) : null}
                <StaffButton variant="ghost" className="staff-btn--icon shrink-0" aria-label="Close" onClick={onClose}>
                  <CloseIcon className="h-4 w-4" />
                </StaffButton>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">{children}</div>
            {footer ? <div>{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
