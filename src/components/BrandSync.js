"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBrand } from "@/hooks/useBrand";

export default function BrandSync() {
  const brand = useBrand();
  const pathname = usePathname();

  useEffect(() => {
    if (!brand) return;

    document.documentElement.setAttribute("data-brand", brand.key);

    const apply = () => {
      if (document.title !== brand.title) {
        document.title = brand.title;
      }

      const meta = document.querySelector('meta[name="description"]');
      if (meta && meta.getAttribute("content") !== brand.description) {
        meta.setAttribute("content", brand.description);
      }
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [brand, pathname]);

  return null;
}
