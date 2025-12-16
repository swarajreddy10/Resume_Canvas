import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-[color-mix(in_srgb,var(--primary)_88%,#60a5fa)] text-primary-foreground shadow-[0_10px_30px_-12px_rgba(37,99,235,0.5)] hover:shadow-[0_16px_36px_-12px_rgba(37,99,235,0.45)] hover:translate-y-[-1px]',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-white/60 text-foreground shadow-[0_8px_30px_-20px_rgba(15,23,42,0.35)] hover:bg-white/80 hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 backdrop-blur-md',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)]',
        ghost:
          'text-foreground/80 hover:bg-primary/10 hover:text-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        glass:
          'glass-panel text-foreground shadow-[0_12px_40px_-24px_rgba(15,23,42,0.55)] hover:-translate-y-[1px]',
      },
      size: {
        default: 'h-11 px-6 py-3 has-[>svg]:px-5',
        sm: 'h-9 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 text-base px-7 has-[>svg]:px-6',
        icon: 'size-11',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
