"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Smile, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { formatMessageTime } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message, MessageError } from "@/types/message";
import { getErrorConfig } from "@/lib/errorHandling";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  currentUserId: Id<"users">;
  error?: MessageError;
  onRetry?: () => void;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

export function MessageBubble({ message, isCurrentUser, showAvatar, currentUserId, error, onRetry }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.reactions.toggleReaction);
  const reactions = useQuery(
    api.reactions.getMessageReactions, 
    message.localId ? "skip" : { messageId: message._id }
  );
  // Use error from props or message object
  const messageError = error || message.error;
  const messageStatus = message.status || 'sent';
  const isSending = messageStatus === 'sending';
  const isFailed = messageStatus === 'failed' || !!messageError;

  const handleDelete = async () => {
    try {
      await deleteMessage({
        messageId: message._id,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleReaction = async (emoji: string) => {
    try {
      await toggleReaction({
        messageId: message._id,
        userId: currentUserId,
        emoji,
      });
      setShowReactionPicker(false);
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  // If message is deleted, show placeholder
  if (message.isDeleted) {
    return (
      <div className={`flex gap-2 mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && showAvatar && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={message.sender?.imageUrl} alt={message.sender?.name} />
            <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
              {message.sender?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        {!isCurrentUser && !showAvatar && <div className="w-8 flex-shrink-0" />}
        
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isCurrentUser
                ? 'bg-blue-100 text-blue-400 rounded-br-sm'
                : 'bg-slate-100 text-slate-400 rounded-bl-sm'
            }`}
          >
            <p className="text-sm italic">This message was deleted</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex gap-2 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'} group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isCurrentUser && showAvatar && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender?.imageUrl} alt={message.sender?.name} />
          <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
            {message.sender?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      )}
      {!isCurrentUser && !showAvatar && <div className="w-8 flex-shrink-0" />}
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%] relative`}>
        {/* Reaction picker - appears above message on hover */}
        {showReactionPicker && !isFailed && !isSending && (
          <div className={`absolute -top-12 ${isCurrentUser ? 'right-0' : 'left-0'} bg-white rounded-full shadow-lg border border-slate-200 px-3 py-2 flex gap-2 z-50 mb-2`}>
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isFailed
                ? 'bg-red-50 text-red-900 border-2 border-red-300 rounded-br-sm'
                : isCurrentUser
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-slate-200 text-slate-900 rounded-bl-sm'
            } ${isSending ? 'opacity-70' : ''}`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            
            {/* Sending indicator */}
            {isSending && (
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Sending...</span>
              </div>
            )}
          </div>

          {/* Error state display */}
          {isFailed && messageError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-red-900">
                    {getErrorConfig(messageError.type).title}
                  </p>
                  <p className="text-xs text-red-700 mt-0.5">
                    {messageError.message}
                  </p>
                </div>
              </div>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full h-7 text-xs bg-white hover:bg-red-50 border-red-300 text-red-700"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {getErrorConfig(messageError.type).action}
                </Button>
              )}
            </div>
          )}

          {/* Hover controls - Three-dot menu and reaction button */}
          {!isFailed && !isSending && (
            <div className={`absolute top-1 ${isCurrentUser ? '-left-20' : '-right-20'} flex gap-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="h-8 w-8 p-0 rounded-full hover:bg-slate-200 bg-white shadow-sm border border-slate-200"
              >
                <Smile className="h-4 w-4 text-slate-500" />
              </Button>
              
              {isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-slate-200 bg-white shadow-sm border border-slate-200"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
        
        {/* Reactions display */}
        {reactions && reactions.length > 0 && !isFailed && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {reactions.map((reaction) => {
              const isUserReaction = reaction.userIds.includes(currentUserId);
              return (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                    isUserReaction
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-slate-600 font-medium">{reaction.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {!isFailed && (
          <span className="text-xs text-slate-400 mt-1 px-1">
            {formatMessageTime(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
