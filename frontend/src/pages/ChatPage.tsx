import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest, API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { ArrowLeft, Send } from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

interface Message {
  id: number;
  matchId: number;
  senderId: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface MatchInfo {
  id: number;
  student: { id: number; name: string; email: string };
  alumni: { id: number; name: string; email: string };
}

export function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId) {
      setError('Match ID is required');
      setLoading(false);
      return;
    }

    const fetchMatchAndMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch messages
        const messagesResponse = await apiRequest<{ messages: Message[] }>(
          `${API_ENDPOINTS.getMessages(parseInt(matchId))}`
        );
        setMessages(messagesResponse.messages || []);

        // Fetch match info
        const matchResponse = await apiRequest<{ match: MatchInfo }>(
          `/match/info/${matchId}`
        );
        setMatchInfo(matchResponse.match || null);

        // Connect to Socket.io
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Disconnect existing socket if any
        if (socketRef.current) {
          socketRef.current.off('new-message');
          socketRef.current.off('error');
          socketRef.current.off('connect');
          socketRef.current.off('disconnect');
          socketRef.current.disconnect();
        }

        const socket = io(API_BASE_URL, {
          auth: { token },
        });

        socketRef.current = socket;

        // Define event handlers
        const handleNewMessage = (message: Message) => {
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            if (prev.some(m => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
        };

        const handleError = (error: { message: string }) => {
          setError(error.message);
        };

        const handleConnect = () => {
          // Connection established
        };

        const handleDisconnect = () => {
          // Connection closed
        };

        // Add event listeners
        socket.on('new-message', handleNewMessage);
        socket.on('error', handleError);
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        // Join match room
        socket.emit('join-match', parseInt(matchId));

        setLoading(false);
      } catch (err) {
        console.error('Error loading chat:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat');
        setLoading(false);
      }
    };

    fetchMatchAndMessages();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        // Remove all event listeners
        socketRef.current.off('new-message');
        socketRef.current.off('error');
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [matchId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !matchId || !socketRef.current || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    socketRef.current.emit('send-message', {
      matchId: parseInt(matchId),
      content: messageContent,
    });

    // Reset sending state after a short delay
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };

  const getOtherUserName = () => {
    if (!matchInfo || !user) return 'User';
    if (user.role === 'student') {
      return matchInfo.alumni.name;
    } else {
      return matchInfo.student.name;
    }
  };

  const getOtherUserRole = () => {
    if (!matchInfo || !user) return '';
    if (user.role === 'student') {
      return 'Mentor';
    } else {
      return 'Student';
    }
  };

  const handleLogoClick = () => {
    if (user?.role === 'student') {
      navigate('/student/dashboard');
    } else if (user?.role === 'alumni') {
      navigate('/mentor/dashboard');
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#C8102E',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
                <img src={waikatoLogo} alt="Waikato" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
              <div style={{ borderLeft: '1px solid #d1d5db', paddingLeft: '1rem' }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>Chat with {getOtherUserName()}</h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{getOtherUserRole()}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    backgroundColor: isOwnMessage ? '#C8102E' : 'white',
                    color: isOwnMessage ? 'white' : '#111827',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: isOwnMessage ? 'none' : '1px solid #e5e7eb',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {!isOwnMessage && (
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', opacity: 0.8 }}>
                      {message.sender.name}
                    </p>
                  )}
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                  </p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '1rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            style={{
              backgroundColor: (newMessage.trim() && !isSending) ? '#C8102E' : '#d1d5db',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: (newMessage.trim() && !isSending) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
