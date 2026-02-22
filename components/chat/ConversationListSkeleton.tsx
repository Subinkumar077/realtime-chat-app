"use client";

interface ConversationListSkeletonProps {
  count?: number;
}

export function ConversationListSkeleton({ count = 5 }: ConversationListSkeletonProps) {
  return (
    <div className="divide-y divide-slate-100" data-testid="conversation-list-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full p-4 flex items-start gap-3">
          {/* Avatar skeleton */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-200 animate-shimmer" />
          </div>
          
          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              {/* Name skeleton */}
              <div className="h-4 bg-slate-200 rounded w-32 animate-shimmer" />
              {/* Timestamp skeleton */}
              <div className="h-3 bg-slate-200 rounded w-16 animate-shimmer" />
            </div>
            {/* Message preview skeleton */}
            <div className="h-3 bg-slate-200 rounded w-full animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
