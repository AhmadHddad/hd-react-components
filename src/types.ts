import { ComponentType } from 'react';

export type LazyLoadProps = {
  $load: boolean;
  $fallback?: React.ReactNode;
  $disableCache?: boolean;
  $cacheKey?: string;
  $importerFunction: () => Promise<{ default: ComponentType }>;
};

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

export type LazyLoadInViewProps = {
  $options: IntersectionObserverInit;
  $divContainerProps: React.HTMLAttributes<HTMLDivElement>;
} & LazyLoadProps;
