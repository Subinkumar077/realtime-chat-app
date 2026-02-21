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
      isDeleted: false,
    });

    // Get conversation to determine recipient
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return messageId;

    // Determine recipient and increment their unread count
    const isParticipant1 = conversation.participant1 === senderId;
    const updateFields: any = {
      lastMessageTime: Date.now(),
      lastMessageText: text,
    };

    if (isParticipant1) {
      // Sender is participant1, increment participant2's unread count
      updateFields.unreadCountUser2 = (conversation.unreadCountUser2 ?? 0) + 1;
    } else {
      // Sender is participant2, increment participant1's unread count
      updateFields.unreadCountUser1 = (conversation.unreadCountUser1 ?? 0) + 1;
    }

    // Update conversation's last message and unread count
    await ctx.db.patch(conversationId, updateFields);

    return messageId;
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { messageId, userId } = args;

    // Get the message
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Check if user is the sender
    if (message.senderId !== userId) {
      throw new Error("You can only delete your own messages");
    }

    // Soft delete: mark as deleted
    await ctx.db.patch(messageId, {
      isDeleted: true,
      deletedAt: Date.now(),
      deletedBy: userId,
    });

    // Update conversation's last message if this was the last message
    const conversation = await ctx.db.get(message.conversationId);
    if (!conversation) return;

    // If this was the last message, find the previous non-deleted message
    if (conversation.lastMessageText === message.text) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", message.conversationId)
        )
        .order("desc")
        .collect();

      // Find the most recent non-deleted message
      const lastNonDeletedMessage = messages.find((msg) => !msg.isDeleted && msg._id !== messageId);

      await ctx.db.patch(message.conversationId, {
        lastMessageText: lastNonDeletedMessage?.text,
        lastMessageTime: lastNonDeletedMessage?.createdAt ?? conversation.lastMessageTime,
      });
    }
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
