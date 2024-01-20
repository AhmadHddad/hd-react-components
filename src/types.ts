import { ComponentType } from 'react';

export type LazyLoadInViewTargetProps<T> = {
  $targetElement?: HTMLElement;
  $intersectionObserverOptions: IntersectionObserverInit;
} & LazyLoadProps<T>;

export type LazyLoadProps<T> = {
  $load: boolean;
  $fallback?: React.ReactNode;
  $disableCache?: boolean;
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

export type LazyLoadInViewProps<
  T,
  K extends keyof JSX.IntrinsicElements = 'div'
> = {
  $options: IntersectionObserverInit;
  $container: K;
  $containerProps: React.ComponentPropsWithoutRef<K>;
} & LazyLoadProps<T>;

export interface BreakpointValues {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  [key: string]: string | undefined;
}

export type GridLayoutOptions<K extends keyof JSX.IntrinsicElements = 'div'> = {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  sx?: CSSStyleDeclaration;
  spacing?: number;
  gap?: number;
  display?: CSSStyleDeclaration['display'];
  flexDirection?: CSSStyleDeclaration['flexDirection'];
  flexWrap?: CSSStyleDeclaration['flexWrap'];
  justifyContent?: CSSStyleDeclaration['justifyContent'];
  alignItems?: CSSStyleDeclaration['alignItems'];
  alignContent?: CSSStyleDeclaration['alignContent'];
  width?: CSSStyleDeclaration['width'];
  height?: CSSStyleDeclaration['height'];
  maxWidth?: CSSStyleDeclaration['maxWidth'];
  maxHeight?: CSSStyleDeclaration['maxHeight'];
  minWidth?: CSSStyleDeclaration['minWidth'];
  minHeight?: CSSStyleDeclaration['minHeight'];
  margin?: CSSStyleDeclaration['margin'];
  padding?: CSSStyleDeclaration['padding'];
  breakpoints?: BreakpointValues;
  component?: K;
} & React.ComponentProps<K>;
