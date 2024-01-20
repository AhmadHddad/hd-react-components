import React, { useState, useEffect } from 'react';
import LazyLoad from './LazyLoad';
import { intersectionObserver as observe } from 'hd-utils';
import { LazyLoadInViewTargetProps } from '../types';

function LazyLoadInViewTarget<T>({
  $fallback,
  $targetElement,
  $intersectionObserverOptions,
  $load = true,
  ...props
}: LazyLoadInViewTargetProps<T>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!$targetElement) throw new Error('$targetElement is not defined');

    const observer = observe($targetElement, isInView => {
      if (isInView) {
        setIsInView(isInView);
        observer();
      }
    });

    return () => {
      if ($targetElement) {
        setIsInView(false);
        observer();
      }
    };
  }, []);

  return <LazyLoad $load={$load && isInView} {...props} />;
}

export default LazyLoadInViewTarget;
