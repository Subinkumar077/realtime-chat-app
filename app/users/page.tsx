"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignOutButton } from "@clerk/nextjs";
import { Search, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { user, isLoaded } = useUser();
  const allUsers = useQuery(api.users.getAllUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Filter out current user and apply search
  const filteredUsers = allUsers?.filter((u) => {
    if (u.clerkId === user?.id) return false;
    if (!searchQuery) return true;
    return u.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const handleUserSelect = (selectedUser: any) => {
    setSelectedUser(selectedUser);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
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
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - User List */}
        <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 bg-white`}>
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No users found</p>
                <p className="text-slate-400 text-sm mt-1">
                  {searchQuery ? "Try a different search" : "No other users available"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleUserSelect(u)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                      selectedUser?._id === u._id ? 'bg-blue-50 hover:bg-blue-50' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={u.imageUrl} alt={u.name} />
                        <AvatarFallback className="bg-slate-200 text-slate-700">
                          {u.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {u.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-slate-900">{u.name}</p>
                      <p className="text-sm text-slate-500">
                        {u.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-50`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
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

              {/* Chat Messages Area */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Chat with {selectedUser.name}</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Messaging feature coming soon
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium text-lg">Select a user to start chatting</p>
                <p className="text-slate-400 text-sm mt-2">
                  Choose from the list on the left to begin a conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
