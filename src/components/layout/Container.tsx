
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: string;
}

const maxWidthMap = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
};

export function Container({
  children,
  className,
  maxWidth = 'xl',
  padding = 'px-4 sm:px-6 py-4',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthMap[maxWidth],
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}
