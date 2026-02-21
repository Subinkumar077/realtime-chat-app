import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const { conversationId, senderId, text } = args;

    // Insert the message
    const messageId = await ctx.db.insert("messages", {
      conversationId,
      senderId,
      text,
      createdAt: Date.now(),
    });

    // Update conversation's last message
    await ctx.db.patch(conversationId, {
      lastMessageTime: Date.now(),
      lastMessageText: text,
    });

    return messageId;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Enrich with sender data
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          sender,
        };
      })
    );

    return enrichedMessages;
  },
});
