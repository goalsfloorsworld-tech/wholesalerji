"use client";

import React from 'react';

export default function WJLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center text-amber-500 ${className}`}>
      <svg width="64" height="48" viewBox="0 0 64 48" className="overflow-visible">
        {/* W Letter Outline Animation */}
        <text 
          x="0" 
          y="38" 
          fontSize="40" 
          fontWeight="bold"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="animate-[drawOutlineW_3s_ease-in-out_infinite]"
        >
          𝕎
        </text>

        {/* J Letter Outline Animation */}
        <text 
          x="34" 
          y="38" 
          fontSize="40" 
          fontWeight="bold"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="animate-[drawOutlineJ_3s_ease-in-out_infinite]"
        >
          𝕁
        </text>
      </svg>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drawOutlineW {
          0% { stroke-dasharray: 300; stroke-dashoffset: 300; fill: transparent; }
          30% { stroke-dasharray: 300; stroke-dashoffset: 0; fill: transparent; }
          40%, 80% { stroke-dasharray: 300; stroke-dashoffset: 0; fill: currentColor; }
          100% { stroke-dasharray: 300; stroke-dashoffset: 300; fill: transparent; }
        }
        @keyframes drawOutlineJ {
          0%, 15% { stroke-dasharray: 300; stroke-dashoffset: 300; fill: transparent; }
          45% { stroke-dasharray: 300; stroke-dashoffset: 0; fill: transparent; }
          55%, 80% { stroke-dasharray: 300; stroke-dashoffset: 0; fill: currentColor; }
          100% { stroke-dasharray: 300; stroke-dashoffset: 300; fill: transparent; }
        }
      `}} />
    </div>
  );
}
