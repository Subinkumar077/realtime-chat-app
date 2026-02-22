"use client";

interface MessageListSkeletonProps {
  count?: number;
  variant?: 'sent' | 'received' | 'mixed';
}

export function MessageListSkeleton({ count = 8, variant = 'mixed' }: MessageListSkeletonProps) {
  const getAlignment = (index: number) => {
    if (variant === 'sent') return 'sent';
    if (variant === 'received') return 'received';
    // Mixed: alternate between sent and received
    return index % 2 === 0 ? 'received' : 'sent';
  };

  const getWidth = (index: number) => {
    // Varying widths to simulate different message lengths
    const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-3/5', 'w-4/5'];
    return widths[index % widths.length];
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="message-list-skeleton">
      {Array.from({ length: count }).map((_, index) => {
        const alignment = getAlignment(index);
        const isSent = alignment === 'sent';
        const width = getWidth(index);

        return (
          <div
            key={index}
            className={`flex gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar skeleton for received messages */}
            {!isSent && (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-shimmer flex-shrink-0" />
            )}

            {/* Message bubble skeleton */}
            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[70%]`}>
              <div
                className={`${width} h-12 rounded-2xl ${
                  isSent
                    ? 'bg-blue-200 rounded-br-sm'
                    : 'bg-slate-200 rounded-bl-sm'
                } animate-shimmer`}
              />
              {/* Timestamp skeleton */}
              <div className="h-3 w-16 bg-slate-200 rounded mt-1 animate-shimmer" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
