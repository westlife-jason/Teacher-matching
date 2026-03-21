"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send, User, MessageSquare } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  sender: { id: string; name: string; image: string | null };
  receiver: { id: string; name: string; image: string | null };
}

interface Conversation {
  user: { id: string; name: string; image: string | null };
  lastMessage: Message;
}

interface MessageListProps {
  conversations: Conversation[];
  selectedMessages: Message[];
  selectedPartnerId: string | null;
  selectedPartner: { id: string; name: string; image: string | null } | null;
  currentUserId: string;
}

export function MessageList({
  conversations,
  selectedMessages,
  selectedPartnerId,
  selectedPartner,
  currentUserId,
}: MessageListProps) {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartnerId) return;
    setSending(true);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedPartnerId, content: newMessage }),
    });

    setNewMessage("");
    setSending(false);
    router.refresh();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">메시지함</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex h-[600px]">
        {/* Conversation List */}
        <div className="w-72 border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">대화 목록</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">대화 내역이 없습니다</p>
              </div>
            ) : (
              conversations.map(({ user, lastMessage }) => (
                <Link
                  key={user.id}
                  href={`/messages?with=${user.id}`}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    selectedPartnerId === user.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lastMessage.content}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedPartner ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <span className="font-semibold text-gray-900">{selectedPartner.name}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedMessages.map((msg) => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          isMine
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-900 rounded-tl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        <p className="text-xs text-gray-400">{formatDateTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>대화를 선택하세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
