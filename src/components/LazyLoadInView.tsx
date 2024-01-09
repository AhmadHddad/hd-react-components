import React, { useRef, useState, useEffect } from 'react';
import LazyLoad from './LazyLoad';
import intersectingService from '../services/intersectingService';
import { LazyLoadInViewProps } from '../types';

export default function LazyLoadInView<T>({
  $options,
  $load = true,
  $divContainerProps,
  ...props
}: LazyLoadInViewProps<T>) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = intersectingService(ref.current, {
      onIntersect: () => {
        setIsInView(true);
      },
      unObserveOnIntersect: true,
    });

    return () => {
      if (ref.current) {
        setIsInView(false);
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} {...($divContainerProps || {})}>
      <LazyLoad $load={$load && isInView} {...props} />
    </div>
  );
}
