import React, { useEffect, useState } from 'react';

const lines = [
  '> booting identity module...',
  '> generating entropy...',
  '> deriving secure key...',
  '> hashing credentials...',
  '> identity created.'
];

const TerminalAnimation = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      onComplete();
      return;
    }

    const line = lines[currentLine];
    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + line[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + '\n');
        setCurrentLine(prev => prev + 1);
        setCharIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, charIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card bg-gray-900 border border-green-500 shadow-xl max-w-2xl w-full">
        <div className="card-body font-mono text-green-400 text-lg">
          <pre className="whitespace-pre-wrap">{displayText}<span className="animate-pulse">_</span></pre>
        </div>
      </div>
    </div>
  );
};

export default TerminalAnimation;