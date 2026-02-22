"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ConversationListSkeleton } from "./ConversationListSkeleton";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

interface User {
  _id: string;
  name: string;
  imageUrl?: string;
  isOnline: boolean;
  clerkId: string;
}

interface Conversation {
  _id: string;
  participant1: string;
  participant2: string;
  lastMessageTime: number;
  lastMessageText?: string;
  unreadCount: number;
  otherUser: User | null;
}

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  selectedConversationId: string | null;
  onConversationSelect: (conversation: Conversation) => void;
  onFindUsers: () => void;
  error?: Error | null;
  onRetry?: () => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onConversationSelect,
  onFindUsers,
  error,
  onRetry,
}: ConversationListProps) {
  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatTimestamp = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* Find Users Button */}
      <div className="p-4 border-b border-slate-200">
        <Button
          onClick={onFindUsers}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Find Users
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {/* Error state - show error display when query fails */}
        {error ? (
          <div className="p-4">
            <ErrorDisplay
              type="service"
              message="Failed to load conversations. Please try again."
              onRetry={onRetry}
              variant="inline"
            />
          </div>
        ) : /* Loading state - show skeleton when data is undefined */
        conversations === undefined ? (
          <ConversationListSkeleton />
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No conversations yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Find users to start chatting
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => {
              if (!conv.otherUser) return null;

              return (
                <button
                  key={conv._id}
                  onClick={() => onConversationSelect(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                    selectedConversationId === conv._id
                      ? "bg-blue-50 hover:bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={conv.otherUser.imageUrl}
                        alt={conv.otherUser.name}
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {conv.otherUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    {conv.otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                    {/* Unread count badge */}
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {conv.otherUser.name}
                      </p>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                        {formatTimestamp(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {conv.lastMessageText
                        ? truncateText(conv.lastMessageText)
                        : "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
