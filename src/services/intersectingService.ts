import { getWindowObj, joinObjects } from 'hd-utils';
import { intersectingServiceOptions } from '../types';

export default function intersectingService(
  target: HTMLElement,
  {
    onObserve,
    onIntersect,
    unObserveOnIntersect,
    ...options
  }: intersectingServiceOptions
) {
  const body = getWindowObj().document.body
  const allOptions = joinObjects(
    {
      root: body,
      rootMargin: '5px',
      threshold: 0.5,
    },
    options
  );
  const observer = new IntersectionObserver(elements => {
    elements.forEach(element => {
      onObserve?.(element, observer);
      if (
        element.isIntersecting &&
        Number(element.intersectionRatio) >= Number(allOptions.threshold)
      ) {
        onIntersect?.(element, observer);

        if (unObserveOnIntersect) {
          observer.unobserve(target);
        }
      }
    });
  }, allOptions);

  observer.observe(target);
  return observer;
}
