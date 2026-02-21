"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Users } from "lucide-react";

interface User {
  _id: string;
  name: string;
  imageUrl?: string;
  isOnline: boolean;
  clerkId: string;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onUserSelect: (user: User) => void;
}

export function UserSearchModal({
  isOpen,
  onClose,
  users,
  onUserSelect,
}: UserSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (user: User) => {
    onUserSelect(user);
    onClose();
    setSearchQuery("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Find Users</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

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
              autoFocus
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
              <Users className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No users found</p>
              <p className="text-slate-400 text-sm mt-1">
                {searchQuery
                  ? "Try a different search"
                  : "No other users available"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.imageUrl} alt={user.name} />
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">
                      {user.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
