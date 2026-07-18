"use client";

import { useEffect, useState } from "react";

const CYPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export default function DecryptedLogo({ text = "Client Scale Systems" }) {
  // Initialize with real text to prevent hydration errors, 
  // but it remains invisible until the client takes over.
  const [displayText, setDisplayText] = useState(text);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 10ms delay ensures the CSS engine registers the starting state 
    // before we trigger the transition to visible.
    const fadeDelay = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    let iteration = -3; // Starts even deeper in the negative for more scrambling time
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setDisplayText((currentText) =>
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < Math.floor(iteration)) return text[index];
            return CYPHER_CHARS[Math.floor(Math.random() * CYPHER_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 2; 
    }, 60); 

    return () => {
      clearInterval(interval);
      clearTimeout(fadeDelay);
    };
  }, [text]);

  return (
    <h1 
      className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 transition-all duration-[1500ms] ease-out ${
        isVisible 
          ? "opacity-100 blur-none translate-y-0" 
          : "opacity-0 blur-md translate-y-2"
      }`}
    >
      {displayText}
    </h1>
  );
}