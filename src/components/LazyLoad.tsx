import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import React from 'react';
import { isNullOrUndefined } from 'hd-utils';
import { LazyLoadProps } from '../types';

const LazyLoad = function({
  $load,
  $disableCache,
  $fallback,
  $cacheKey,
  $importerFunction,
  ...props
}: LazyLoadProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const isFirstChangeRef = useRef(false);

  if (isNullOrUndefined($importerFunction)) {
    throw new Error('$importerFunction is not defined');
  }

  useEffect(() => {
    if ($disableCache && !$load) {
      setComponent(null);
      return;
    }

    if (!$load) return;
    if (isFirstChangeRef.current && !$disableCache) return;

    try {
      setComponent(lazy($importerFunction));
    } catch (error) {
      throw new Error(
        `Error with the $importerFunction ${JSON.stringify(error)}`
      );
    }
    isFirstChangeRef.current = true;
  }, [$load, $disableCache]);

  if (
    (!$load && !isFirstChangeRef.current) ||
    !Component ||
    (!$load && $disableCache)
  )
    return;

  return (
    <Suspense fallback={$fallback || <div />}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyLoad;