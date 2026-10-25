"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Clock, ExternalLink } from "lucide-react";
import { NotificationItem } from "@/types/api";
import { api } from "@/lib/api";
import { formatTimeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const items = await api.getNotifications();
      setNotifications(Array.isArray(items) ? items : []);
    } catch (e) {
      console.warn("Could not load notifications:", e);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 ring-2 ring-white dark:ring-slate-900 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-12 sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-white/15 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge variant="cyan" className="text-[10px] px-1.5 py-0">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10">
            {isLoading && safeNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading notifications...
              </div>
            ) : safeNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications yet. You're completely up to date!
              </div>
            ) : (
              safeNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.is_read && handleMarkOneRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer text-left hover:bg-slate-50 dark:hover:bg-white/5 ${
                    !item.is_read ? "bg-cyan-50/70 dark:bg-cyan-950/30 border-l-2 border-cyan-500 dark:border-cyan-400" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeAgo(item.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {item.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
