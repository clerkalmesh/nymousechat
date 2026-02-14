import React, { useEffect, useState } from "react";

const lines = [
  "> booting identity module...",
  "> generating entropy...",
  "> deriving secure key...",
  "> hashing credentials...",
  "> identity created."
];

const TerminalAnimation = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      const done = setTimeout(onComplete, 400);
      return () => clearTimeout(done);
    }

    const line = lines[currentLine];

    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + line[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 25 + Math.random() * 35);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + "\n");
        setCurrentLine(prev => prev + 1);
        setCharIndex(0);
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [currentLine, charIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl mx-4">

        <div className="absolute inset-0 bg-green-500/5 blur-3xl"></div>

        <div className="relative bg-black border border-green-500/30 rounded-xl shadow-2xl overflow-hidden">

          <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/10 bg-green-500/5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            <div className="ml-2 text-xs text-green-400/60 font-mono">
              secure-terminal
            </div>
          </div>

          <div className="relative p-6 font-mono text-green-400 text-lg">

            <div className="scanlines absolute inset-0 pointer-events-none"></div>
            <div className="noise absolute inset-0 pointer-events-none"></div>

            <pre className="whitespace-pre-wrap leading-relaxed">
              {displayText}
              <span className="terminal-cursor">█</span>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalAnimation;