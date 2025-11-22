"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { NavigationButton } from './navigation-button';

export interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
  loadingPrevious?: boolean;
  loadingNext?: boolean;
  className?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
  loadingPrevious = false,
  loadingNext = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-4', className)}>
      <NavigationButton
        direction="previous"
        onClick={onPrevious}
        disabled={disablePrevious}
        loading={loadingPrevious}
      />
      
      <NavigationButton
        direction="next"
        onClick={onNext}
        disabled={disableNext}
        loading={loadingNext}
      />
    </div>
  );
};

NavigationButtons.displayName = 'NavigationButtons';

export { NavigationButtons };
