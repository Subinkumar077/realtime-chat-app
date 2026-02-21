"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ConversationList } from "@/components/chat/ConversationList";
import { UserSearchModal } from "@/components/chat/UserSearchModal";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Id } from "@/convex/_generated/dataModel";

export default function UsersPage() {
  const { user, isLoaded } = useUser();
  const allUsers = useQuery(api.users.getAllUsers);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const conversations = useQuery(
    api.conversations.getUserConversations,
    currentUser ? { userId: currentUser._id as Id<"users"> } : "skip"
  );
  const syncUser = useMutation(api.users.syncUser);
  const updateUserStatus = useMutation(api.users.updateUserStatus);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  // Auto-sync user to Convex if not exists
  useEffect(() => {
    if (isLoaded && user && currentUser === null) {
      syncUser({
        clerkId: user.id,
        name: user.fullName || user.firstName || "User",
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl,
      });
    }
  }, [isLoaded, user, currentUser, syncUser]);

  // Online status management
  useEffect(() => {
    if (!user?.id) return;

    // Set online when component mounts
    updateUserStatus({ clerkId: user.id, isOnline: true });

    // Heartbeat: Update status every 30 seconds
    const heartbeatInterval = setInterval(() => {
      updateUserStatus({ clerkId: user.id, isOnline: true });
    }, 30000);

    // Handle browser close/refresh
    const handleBeforeUnload = () => {
      updateUserStatus({ clerkId: user.id, isOnline: false });
    };

    // Handle tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateUserStatus({ clerkId: user.id, isOnline: false });
      } else {
        updateUserStatus({ clerkId: user.id, isOnline: true });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup: Set offline when component unmounts
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updateUserStatus({ clerkId: user.id, isOnline: false });
    };
  }, [user?.id, updateUserStatus]);

  // Handle sign out
  const handleSignOut = () => {
    if (user?.id) {
      updateUserStatus({ clerkId: user.id, isOnline: false });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading user data...</div>
      </div>
    );
  }

  if (currentUser === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Syncing user...</div>
      </div>
    );
  }

  // Filter users for search modal (show ALL users except current user)
  const availableUsers = allUsers?.filter((u) => {
    if (u.clerkId === user?.id) return false; // Exclude yourself
    return true;
  }) || [];

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation);
    setShowChat(true);
  };

  const handleUserSelectFromSearch = (selectedUser: any) => {
    // Check if conversation already exists
    const existingConv = conversations?.find(
      (conv) => conv.otherUser?._id === selectedUser._id
    );

    if (existingConv) {
      // If conversation exists, open it
      setSelectedConversation(existingConv);
    } else {
      // Create a temporary conversation object for the selected user
      setSelectedConversation({
        otherUser: selectedUser,
        _id: null, // Will be created by ChatWindow
      });
    }
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <SignOutButton>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-slate-900"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 bg-white`}>
          <ConversationList
            conversations={conversations || []}
            selectedConversationId={selectedConversation?._id || null}
            onConversationSelect={handleConversationSelect}
            onFindUsers={() => setShowUserSearch(true)}
          />
        </div>

        <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-50`}>
          {selectedConversation?.otherUser ? (
            <ChatWindow
              selectedUser={selectedConversation.otherUser}
              currentUserId={currentUser._id as Id<"users">}
              conversationId={selectedConversation._id}
              onBack={handleBackToList}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium text-lg">Select a conversation to start chatting</p>
                <p className="text-slate-400 text-sm mt-2">
                  Choose from the list on the left to begin a conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserSearchModal
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        users={availableUsers}
        onUserSelect={handleUserSelectFromSearch}
      />
    </div>
  );
}
