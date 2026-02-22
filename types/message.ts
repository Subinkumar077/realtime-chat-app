/**
 * Extended message types with client-side error state management
 */

import { Id } from "@/convex/_generated/dataModel";

/**
 * Error information for failed message operations
 */
export interface MessageError {
  type: 'network' | 'service' | 'validation' | 'auth';
  message: string;
  timestamp: number;
}

/**
 * Message status for tracking send state
 */
export type MessageStatus = 'sending' | 'sent' | 'failed';

/**
 * Base message structure from Convex database
 */
export interface BaseMessage {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
  text: string;
  createdAt: number;
  isDeleted?: boolean;
  deletedAt?: number;
  deletedBy?: Id<"users">;
  sender?: {
    name: string;
    imageUrl?: string;
    clerkId: string;
    email: string;
    isOnline: boolean;
    lastSeen: number;
  } | null;
}

/**
 * Extended message with client-side error tracking and optimistic updates
 */
export interface Message extends BaseMessage {
  // Client-side error tracking
  error?: MessageError;
  
  // Client-side sending state
  status?: MessageStatus;
  
  // Temporary ID for optimistic updates (before backend assigns real ID)
  localId?: string;
}

/**
 * Optimistic message for immediate UI feedback
 */
export interface OptimisticMessage {
  localId: string;
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
  text: string;
  createdAt: number;
  status: 'sending';
}
