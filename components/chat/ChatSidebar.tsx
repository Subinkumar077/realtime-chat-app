"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";

interface User {
  _id: string;
  name: string;
  imageUrl?: string;
  isOnline: boolean;
  clerkId: string;
}

interface ChatSidebarProps {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (user: User) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ChatSidebar({
  users,
  selectedUserId,
  onUserSelect,
  searchQuery,
  onSearchChange,
}: ChatSidebarProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No users found</p>
            <p className="text-slate-400 text-sm mt-1">
              {searchQuery ? "Try a different search" : "No other users available"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <button
                key={u._id}
                onClick={() => onUserSelect(u)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                  selectedUserId === u._id ? 'bg-blue-50 hover:bg-blue-50' : ''
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
    </>
  );
}
