import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  conversations: defineTable({
    participant1: v.id("users"),
    participant2: v.id("users"),
    lastMessageTime: v.number(),
    lastMessageText: v.optional(v.string()),
    unreadCountUser1: v.optional(v.number()),
    unreadCountUser2: v.optional(v.number()),
  })
    .index("by_participant1", ["participant1"])
    .index("by_participant2", ["participant2"])
    .index("by_participants", ["participant1", "participant2"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
    deletedBy: v.optional(v.id("users")),
  }).index("by_conversation", ["conversationId", "createdAt"]),

  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
    createdAt: v.number(),
  })
    .index("by_message", ["messageId"])
    .index("by_user_message", ["userId", "messageId"]),

  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
    lastTypingTime: v.number(),
  }).index("by_conversation", ["conversationId"]),
});
