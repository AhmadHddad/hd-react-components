import React, { useRef, useState, useEffect } from 'react';
import LazyLoad from './LazyLoad';
import intersectingService from '../services/intersectingService';
import { LazyLoadInViewProps } from '../types';

export default function LazyLoadInView<T>({
  $options,
  $load = true,
  $container = 'div',
  $containerProps,
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
      ...$options,
    });

    return () => {
      if (ref.current) {
        setIsInView(false);
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return React.createElement($container, {
    ...$containerProps,
    ref,
    children: <LazyLoad $load={$load && isInView} {...props} />,
  });
}
