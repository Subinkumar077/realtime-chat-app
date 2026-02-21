"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ArrowDown } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { DateSeparator } from "./DateSeparator";
import { TypingIndicator } from "./TypingIndicator";
import { shouldShowDateSeparator } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  _id: string;
  name: string;
  imageUrl?: string;
  isOnline: boolean;
  clerkId: string;
}

interface ChatWindowProps {
  selectedUser: User;
  currentUserId: Id<"users">;
  conversationId: Id<"conversations"> | null;
  onBack: () => void;
}

export function ChatWindow({ selectedUser, currentUserId, conversationId: propConversationId, onBack }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);
  const markConversationAsRead = useMutation(api.conversations.markConversationAsRead);
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(propConversationId);
  const [isLoadingConversation, setIsLoadingConversation] = useState(!propConversationId);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const previousMessageCountRef = useRef(0);

  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  const typingUsers = useQuery(
    api.typing.getTypingUsers,
    conversationId ? { conversationId } : "skip"
  );

  // Filter out current user from typing users
  const otherUserTyping = typingUsers?.find((user) => user.userId !== currentUserId);

  // Check if user is at bottom of scroll
  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= threshold;
  };

  // Handle scroll event
  const handleScroll = () => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    
    // If user scrolled to bottom, reset new message count
    if (atBottom) {
      setNewMessageCount(0);
    }
  };

  // Get or create conversation
  useEffect(() => {
    const initConversation = async () => {
      // If conversation ID is provided via props, use it
      if (propConversationId) {
        setConversationId(propConversationId);
        setIsLoadingConversation(false);
        // Mark as read when opening conversation
        await markConversationAsRead({
          conversationId: propConversationId,
          userId: currentUserId,
        });
        return;
      }

      // Otherwise, get or create conversation
      setIsLoadingConversation(true);
      try {
        const convId = await getOrCreateConversation({
          userId1: currentUserId,
          userId2: selectedUser._id as Id<"users">,
        });
        setConversationId(convId);
        // Mark as read when opening conversation
        await markConversationAsRead({
          conversationId: convId,
          userId: currentUserId,
        });
      } catch (error) {
        console.error("Failed to get/create conversation:", error);
      } finally {
        setIsLoadingConversation(false);
      }
    };

    initConversation();
  }, [selectedUser._id, currentUserId, propConversationId, getOrCreateConversation, markConversationAsRead]);

  // Smart auto-scroll: only scroll if user is at bottom
  useEffect(() => {
    if (!messages) return;

    const currentMessageCount = messages.length;
    const previousMessageCount = previousMessageCountRef.current;

    // If this is the first load, scroll to bottom
    if (previousMessageCount === 0 && currentMessageCount > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      previousMessageCountRef.current = currentMessageCount;
      return;
    }

    // If new messages arrived
    if (currentMessageCount > previousMessageCount) {
      const newMessages = currentMessageCount - previousMessageCount;

      if (isAtBottom) {
        // User is at bottom, auto-scroll
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setNewMessageCount(0);
      } else {
        // User is scrolled up, increment new message count
        setNewMessageCount((prev) => prev + newMessages);
      }
    }

    previousMessageCountRef.current = currentMessageCount;
  }, [messages, isAtBottom]);

  const handleMessageSent = () => {
    // Always scroll to bottom after sending
    setIsAtBottom(true);
    setNewMessageCount(0);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToBottom = () => {
    setIsAtBottom(true);
    setNewMessageCount(0);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={selectedUser.imageUrl} alt={selectedUser.name} />
          <AvatarFallback className="bg-slate-200 text-slate-700">
            {selectedUser.name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-slate-900">{selectedUser.name}</p>
          <p className="text-xs text-slate-500">
            {selectedUser.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-slate-50 p-4 relative"
      >
        {isLoadingConversation ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : messages === undefined ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-slate-500 font-medium">No messages yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Start the conversation with {selectedUser.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, index) => {
              const showDateSep = shouldShowDateSeparator(
                msg.createdAt,
                index > 0 ? messages[index - 1].createdAt : null
              );
              const isCurrentUser = msg.senderId === currentUserId;
              const showAvatar =
                !isCurrentUser &&
                (index === messages.length - 1 ||
                  messages[index + 1].senderId !== msg.senderId);

              return (
                <div key={msg._id}>
                  {showDateSep && <DateSeparator timestamp={msg.createdAt} />}
                  <MessageBubble
                    message={msg}
                    isCurrentUser={isCurrentUser}
                    showAvatar={showAvatar}
                    currentUserId={currentUserId}
                  />

                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
        {otherUserTyping && <TypingIndicator userName={otherUserTyping.userName} />}

        {/* New Messages Button */}
        {!isAtBottom && newMessageCount > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={scrollToBottom}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center gap-2"
            >
              <ArrowDown className="w-4 h-4" />
              {newMessageCount} new {newMessageCount === 1 ? "message" : "messages"}
            </Button>
          </div>
        )}
      </div>

      {/* Message Input */}
      {conversationId && (
        <MessageInput
          conversationId={conversationId}
          senderId={currentUserId}
          onMessageSent={handleMessageSent}
        />
      )}
    </>
  );
}
