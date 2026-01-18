'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface MotionCardProps extends HTMLMotionProps<'div'> {
  animated?: boolean;
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, animated = true, children, ...props }, ref) => {
    const motionProps = animated
      ? {
          whileHover: { scale: 1.02, y: -4 },
          transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl border bg-card text-card-foreground shadow',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionCard.displayName = 'MotionCard';

const MotionCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
MotionCardHeader.displayName = 'MotionCardHeader';

const MotionCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
MotionCardTitle.displayName = 'MotionCardTitle';

const MotionCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
MotionCardDescription.displayName = 'MotionCardDescription';

const MotionCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
MotionCardContent.displayName = 'MotionCardContent';

const MotionCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
MotionCardFooter.displayName = 'MotionCardFooter';

export {
  MotionCard,
  MotionCardHeader,
  MotionCardFooter,
  MotionCardTitle,
  MotionCardDescription,
  MotionCardContent,
};
