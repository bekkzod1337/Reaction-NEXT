"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      router.push("/"); // agar username bor bo‘lsa, to‘g‘ridan-to‘g‘ri o‘yinga o‘tadi
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      router.push("/"); // asosiy sahifaga (o‘yin) o‘tadi
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col gap-4 w-80"
      >
        <h1 className="text-white text-2xl font-bold text-center">Kirish</h1>
        <input
  type="text"
  placeholder="Username kiriting"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="p-3 rounded-md outline-none bg-gray-700 text-white placeholder-gray-400"
/>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-semibold"
        >
          Davom etish
        </button>
      </form>
    </div>
  );
}
    