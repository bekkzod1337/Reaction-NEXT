"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactionTest from "./components/ReactionTest";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <ReactionTest />
    </div>
  );
}
