"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface MessageInputProps {
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
  onMessageSent?: () => void;
}

export function MessageInput({ conversationId, senderId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTypingStatus = useMutation(api.typing.setTypingStatus);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 96; // 4 lines * 24px
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  // Handle typing status
  const handleTyping = () => {
    // Set typing status to true
    setTypingStatus({
      conversationId,
      userId: senderId,
      isTyping: true,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to clear typing status after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus({
        conversationId,
        userId: senderId,
        isTyping: false,
      });
    }, 2000);
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    // Clear typing status immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTypingStatus({
      conversationId,
      userId: senderId,
      isTyping: false,
    });

    setIsSending(true);
    try {
      await sendMessage({
        conversationId,
        senderId,
        text: trimmedMessage,
      });
      setMessage("");
      onMessageSent?.();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[40px] max-h-24 resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          size="icon"
          className="flex-shrink-0 h-10 w-10"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
