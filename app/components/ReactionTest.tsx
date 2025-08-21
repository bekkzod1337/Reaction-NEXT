"use client";

import { useState, useEffect, useRef } from "react";

type Score = {
  username: string;
  score: number;
};

export default function ReactionTest() {
  const [status, setStatus] = useState<"waiting" | "ready" | "now" | "result">("waiting");
  const [message, setMessage] = useState("Boshlash uchun bos!");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<Score | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleClick = () => {
    if (status === "waiting") {
      setMessage("Kut...");
      setStatus("ready");

      const randomDelay = Math.floor(Math.random() * 3000) + 2000;
      timeoutRef.current = setTimeout(() => {
        setStatus("now");
        setMessage("BOS!");
        startTimeRef.current = Date.now();
      }, randomDelay);
    } else if (status === "ready") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("waiting");
      setMessage("Ertaroq bosding 😅 Qaytadan urin!");
    } else if (status === "now") {
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      setStatus("result");
      setMessage(`Reaksiya vaqti: ${reaction} ms`);

      const username = localStorage.getItem("username") || "Anonim";

      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score: reaction }),
      }).then(() => fetchBestScore());
    } else if (status === "result") {
      setReactionTime(null);
      setStatus("waiting");
      setMessage("Boshlash uchun bos!");
    }
  };

  const fetchBestScore = async () => {
    const res = await fetch("/api/scores");
    const data = await res.json();
    if (data.scores && data.scores.length > 0) {
      const best = data.scores.reduce(
        (prev: Score, curr: Score) => (curr.score < prev.score ? curr : prev)
      );
      setBestScore(best);
    }
  };

  useEffect(() => {
    fetchBestScore();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const bgClass =
    status === "waiting"
      ? "bg-red-600"
      : status === "ready"
      ? "bg-red-800"
      : status === "now"
      ? "bg-green-600"
      : "bg-blue-600";

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center h-screen w-screen 
        ${bgClass} transition-colors duration-300 cursor-pointer select-none`}
    >
      <div className="text-white text-5xl sm:text-7xl font-extrabold text-center">
        {message}
      </div>

      {bestScore && (
        <div className="mt-8 text-xl sm:text-2xl text-white font-medium">
          <p>
            🏆 Eng yaxshi natija:{" "}
            <span className="font-bold">{bestScore.score} ms</span> (
            {bestScore.username})
          </p>
          {reactionTime && reactionTime === bestScore.score && (
            <p className="mt-2 text-green-300">
              🎉 Bu SENING eng yaxshi natijang!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
