import { ComponentType } from 'react';

export type LazyLoadProps<T> = {
  $load: boolean;
  $fallback?: React.ReactNode;
  $disableCache?: boolean;
  $cacheKey?: string;
  $importerFunction: () => Promise<{ default: ComponentType<any> }>;
} & T;

export type intersectingServiceOptions = IntersectionObserverInit & {
  unObserveOnIntersect?: boolean;
  onObserve?: (
    element: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => void;
  onIntersect?: (
    element: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => void;
};

export type LazyLoadInViewProps<T> = {
  $options: IntersectionObserverInit;
  $divContainerProps: React.HTMLAttributes<HTMLDivElement>;
} & LazyLoadProps<T>;
