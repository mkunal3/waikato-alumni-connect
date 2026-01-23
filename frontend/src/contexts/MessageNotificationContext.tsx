import React, { createContext, useContext, useState, useEffect, useCallback, useRef, PropsWithChildren } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE_URL, API_ENDPOINTS, apiRequest } from '../config/api';

interface UnreadMessage {
  matchId: number;
  count: number;
  lastMessage?: {
    content: string;
    senderName: string;
    createdAt: string;
  };
}

interface MessageNotificationContextType {
  unreadCount: number;
  unreadMessages: Map<number, UnreadMessage>;
  markAsRead: (matchId: number) => void;
  clearAll: () => void;
  setCurrentMatchId: (matchId: number | null) => void;
}

const MessageNotificationContext = createContext<MessageNotificationContextType | undefined>(undefined);

export function MessageNotificationProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState<Map<number, UnreadMessage>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const currentMatchIdRef = useRef<number | null>(null);

  // Calculate total unread count
  const unreadCount = Array.from(unreadMessages.values()).reduce((sum, msg) => sum + msg.count, 0);

  // Update page title with unread count
  useEffect(() => {
    const originalTitle = document.title.replace(/^\(\d+\)\s*/, '');
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
  }, [unreadCount]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show browser notification
  const showNotification = useCallback((message: UnreadMessage) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('New Message', {
        body: message.lastMessage 
          ? `${message.lastMessage.senderName}: ${message.lastMessage.content.slice(0, 50)}${message.lastMessage.content.length > 50 ? '...' : ''}`
          : 'You have a new message',
        icon: '/waikato-logo.png',
        tag: `match-${message.matchId}`,
        requireInteraction: false,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  // Connect to Socket.io and listen for messages
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(API_BASE_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', async () => {
      // Join all matches the user is part of
      try {
        // Fetch user's matches
        const matchResponse = await apiRequest<{ match: { id: number } | null }>(API_ENDPOINTS.myMatch).catch(() => ({ match: null }));
        if (matchResponse.match) {
          socket.emit('join-match', matchResponse.match.id);
        }
      } catch (error) {
        // Silently fail - matches will be joined when user navigates to chat
        console.debug('Could not fetch matches for notification:', error);
      }
    });

    socket.on('new-message', (message: any) => {
      // Only count as unread if not currently viewing this match
      const matchId = message.matchId;
      const isCurrentMatch = currentMatchIdRef.current === matchId;
      
      if (!isCurrentMatch && message.senderId !== user.id) {
        setUnreadMessages((prev) => {
          const newMap = new Map(prev);
          const existing = newMap.get(matchId) || { matchId, count: 0 };
          
          const updated: UnreadMessage = {
            matchId,
            count: existing.count + 1,
            lastMessage: {
              content: message.content,
              senderName: message.sender?.name || 'Someone',
              createdAt: message.createdAt,
            },
          };
          
          newMap.set(matchId, updated);
          
          // Show notification for the first unread message or when count increases
          if (existing.count === 0 || updated.count === existing.count + 1) {
            showNotification(updated);
          }
          
          return newMap;
        });
      }
    });

    socket.on('disconnect', () => {
      // Handle disconnect
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user, showNotification]);

  // Mark messages as read for a specific match
  const markAsRead = useCallback((matchId: number) => {
    setUnreadMessages((prev) => {
      const newMap = new Map(prev);
      newMap.delete(matchId);
      return newMap;
    });
  }, []);

  // Clear all unread messages
  const clearAll = useCallback(() => {
    setUnreadMessages(new Map());
  }, []);

  // Expose function to set current match ID (for ChatPage)
  const setCurrentMatchId = useCallback((matchId: number | null) => {
    currentMatchIdRef.current = matchId;
    // Mark as read when viewing the match
    if (matchId !== null) {
      markAsRead(matchId);
    }
  }, [markAsRead]);

  const contextValue: MessageNotificationContextType = {
    unreadCount,
    unreadMessages,
    markAsRead,
    clearAll,
    setCurrentMatchId,
  };

  return (
    <MessageNotificationContext.Provider value={contextValue}>
      {children}
    </MessageNotificationContext.Provider>
  );
}

export function useMessageNotification() {
  const context = useContext(MessageNotificationContext);
  if (context === undefined) {
    throw new Error('useMessageNotification must be used within a MessageNotificationProvider');
  }
  return context;
}
