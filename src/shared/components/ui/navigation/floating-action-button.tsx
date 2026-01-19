'use client';

import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: ReactNode;
  label?: string;
  className?: string;
}

export function FloatingActionButton({
  onClick,
  icon = <Plus className="h-6 w-6" />,
  label = 'Create',
  className,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-white shadow-lg',
        className
      )}
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </motion.button>
  );
}
