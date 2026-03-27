import { useSocket } from '@/contexts/SocketContext';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { X, Send } from 'lucide-react';

const Chat = ({chatVisibility, setChatVisibility}) => {
  const { interviewSessionData } = useSelector((state) => state.interviewSession);
  const { socket, isConnected, joinRoom, leaveRoom, sendMessage: sendSocketMessage, addEventListener } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const saveMessagesToStorage = (msgs) => {
    try {
      const key = `chat_${interviewSessionData?.roomId}`;
      sessionStorage.setItem(key, JSON.stringify(msgs));
    } catch (error) {
      console.log('Could not save chat messages:', error);
    }
  };

  const loadMessagesFromStorage = () => {
    try {
      const key = `chat_${interviewSessionData?.roomId}`;
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const parsedMessages = JSON.parse(saved);
        console.log('📜 Restored chat history:', parsedMessages.length, 'messages');
        return parsedMessages;
      }
    } catch (error) {
      console.log('Could not load chat messages:', error);
    }
    return [];
  }

  useEffect(() => {
    if (interviewSessionData?.roomId) {
      const savedMessages = loadMessagesFromStorage();
      setMessages(savedMessages);
    }
  }, [interviewSessionData?.roomId]);

  useEffect(() => {
    if (!isConnected || !socket || !interviewSessionData?.roomId) return;   
    const handleChatMessage = (data) => {
      console.log('💬 Chat message received:', data);
      setMessages(prev => {
        const newMessages = [...prev, {
          type: 'message',
          user: data.user,
          message: data.message,
          timestamp: data.timestamp
        }];
        saveMessagesToStorage(newMessages);
        return newMessages;
      });
    };

    const removeListener = addEventListener('chat-message' , handleChatMessage);

    return () => removeListener();
  },[socket , isConnected, interviewSessionData, addEventListener]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;
    if (!socket || !isConnected || !interviewSessionData?.roomId) return;

    const sent = sendSocketMessage(interviewSessionData.roomId, newMessage.trim());
    if (sent) {
      setNewMessage('');
    } else{
      console.warn('⚠️ Message not sent. Socket may be disconnected.');
    }
      
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`fixed ${chatVisibility ? 'right-0' : '-right-full'} top-0 z-30 h-full w-full sm:w-[21rem] md:w-[25rem] bg-[#1a1a1a] shadow-2xl transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <h2 className="text-white font-semibold text-lg">Chat</h2>
        </div>
        <button
          onClick={() => setChatVisibility(false)}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0a0a0a] custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <Send className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-gray-600 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.user === interviewSessionData?.email;
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] text-white rounded-br-md'
                      : 'bg-[#2a2a2a] text-gray-100 rounded-bl-md'
                  } shadow-lg`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs text-gray-400 mb-1 font-medium">
                      {msg.user || 'Anonymous'}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                  <p className={`text-xs mt-1.5 ${isCurrentUser ? 'text-purple-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/30">
          <p className="text-xs text-yellow-500 text-center">Connecting to chat...</p>
        </div>
      )}






      {/* Input Container */}
      <div className="p-4 bg-[#1a1a1a] border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-[#2a2a2a] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2] border border-gray-700 transition-all"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#6A38C2] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg hover:shadow-purple-500/50 disabled:shadow-none flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat