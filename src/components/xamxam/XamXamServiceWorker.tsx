"use client";

import { useEffect } from "react";

export default function XamXamServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/xamxam-sw.js", { scope: "/xamxam/" })
        .catch(() => {});
    }
  }, []);

  return null;
}
