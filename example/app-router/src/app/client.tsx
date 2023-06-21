"use client";

import { useEffect } from "react";

export default function Alerter(){
  useEffect(() => {
    let timeout: any = setTimeout(() => {
      window.alert("a");
      timeout = null;
    }, 5e3);
    return () => timeout && clearTimeout(timeout);
  }, []);

  return (
    <span>client component</span>
  )
}
