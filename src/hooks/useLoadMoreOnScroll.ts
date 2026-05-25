"use client";

import { useCallback, useEffect, useRef } from "react";

export function useLoadMoreOnScroll(onLoadMore: () => void, enabled: boolean) {
  const onLoadMoreRef = useRef(onLoadMore);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            onLoadMoreRef.current();
          }
        },
        { root: null, rootMargin: "320px", threshold: 0 },
      );

      observerRef.current.observe(node);
    },
    [enabled],
  );

  return ref;
}
