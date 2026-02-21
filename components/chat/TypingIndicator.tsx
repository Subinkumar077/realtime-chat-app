"use client";

interface TypingIndicatorProps {
  userName: string;
}

export function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 mb-2">
      <div className="bg-slate-200 rounded-2xl px-4 py-2 max-w-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">{userName} is typing</span>
          <div className="flex gap-1">
            <span className="dot w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
            <span className="dot w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
            <span className="dot w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        .dot {
          animation: pulse 1.4s infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
