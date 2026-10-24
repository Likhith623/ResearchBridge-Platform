"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCheck,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ResearchRequest, RequestMessage } from "@/types/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatTimeAgo } from "@/lib/utils";

export default function MessagesPage() {
  const { user, role } = useAuth();
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's active requests
  useEffect(() => {
    async function loadConversations() {
      setIsLoadingRequests(true);
      try {
        const reqs = await api.getResearchRequests();
        setRequests(reqs || []);
        if (reqs && reqs.length > 0) {
          setSelectedRequestId(reqs[0].id);
        }
      } catch (err) {
        console.error("Failed to load conversation requests:", err);
      } finally {
        setIsLoadingRequests(false);
      }
    }
    loadConversations();
  }, [role, user]);

  // Load messages for selected request
  useEffect(() => {
    if (!selectedRequestId) return;
    async function loadThread() {
      setIsLoadingMessages(true);
      try {
        const res = await api.getMessages(selectedRequestId!);
        setMessages(res.messages || []);
        await api.markMessagesRead(selectedRequestId!);
      } catch (err) {
        console.error("Failed to load thread messages:", err);
      } finally {
        setIsLoadingMessages(false);
      }
    }
    loadThread();

    // Poll every 5s for realtime updates
    const timer = setInterval(loadThread, 5000);
    return () => clearInterval(timer);
  }, [selectedRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRequestId || isSending) return;

    const text = messageInput.trim();
    setMessageInput("");
    setIsSending(true);

    try {
      const newMsg = await api.sendMessage(selectedRequestId, text);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Research Collaboration Messaging
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Secure communication channel scoped to specific research applications.
        </p>
      </div>

      {/* Main 2-Panel Messenger */}
      <Card className="flex-1 flex overflow-hidden border-slate-200">
        {/* Left Column: Conversation List */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-100 bg-white">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Conversations ({requests.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoadingRequests ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading conversations...
              </div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active collaboration threads.
              </div>
            ) : (
              requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer hover:bg-slate-100/70 ${
                    selectedRequestId === req.id ? "bg-blue-50/70 border-r-2 border-r-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {role === "professor" ? (req.student_name || "Applicant") : (req.professor_name || "Supervisor")}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                      {req.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate font-medium">
                    {req.subject}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-1">
                    {formatTimeAgo(req.created_at)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Chat History & Input */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedRequest ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedRequest.subject}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Participant:{" "}
                    <strong>
                      {role === "professor"
                        ? selectedRequest.student_name || "Student Applicant"
                        : selectedRequest.professor_name || "Professor"}
                    </strong>
                  </p>
                </div>
                <Badge variant="teal" className="text-xs capitalize">
                  {selectedRequest.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Message Bubbles Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                {isLoadingMessages && messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No messages yet in this conversation. Send the first message below!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${
                          isCurrentUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            isCurrentUser
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {msg.sender_role === "professor" ? "P" : "S"}
                        </div>
                        <div
                          className={`p-3 rounded-2xl max-w-[70%] text-xs leading-relaxed ${
                            isCurrentUser
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-none"
                          }`}
                        >
                          <p>{msg.message_body}</p>
                          <span
                            className={`text-[9px] block text-right mt-1 ${
                              isCurrentUser ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {formatTimeAgo(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <div className="p-3 border-t border-slate-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message to collaborator..."
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!messageInput.trim() || isSending}
                    isLoading={isSending}
                    className="p-2.5 rounded-xl"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a collaboration conversation to begin chatting.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
