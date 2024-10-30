"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    
    if (typeof jwt === "string") {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return null;
}
