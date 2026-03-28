import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import io from 'socket.io-client';


const SocketContext = createContext();

const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export const SocketProvider = ({ children, user }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    const socketConnection = useMemo(() => {
    if (!user) {
      console.log('🚫 No user, skipping socket');
      return null;
    }

    console.log('🔗 Creating socket for:', user.name || user.id);
    return io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
    });
  }, [user, SERVER_URL]);

  //setup socket events

  useEffect(() => {
    if (!socketConnection){
        setSocket(null);
        setIsConnected(false);
        return;
    }

    setSocket(socketConnection);

    socketConnection.on('connect' , () => {
        console.log('✅ Socket connected:', socketConnection.id);
        setIsConnected(true);
    });

    socketConnection.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
    });

    return () => {
      console.log('🧹 Cleaning up socket');
      if (socketConnection.connected) {
        socketConnection.disconnect();
      }
    };
  }, [socketConnection]);


  //join room

  const joinRoom = useCallback((roomId) => {
    if (!socket || !socket.connected){
        console.log('🚫 Socket not connected, cannot join room');
        return false;
    }

    socket.emit('join-room' , {
        callId : roomId,
        user : user
    });

    return true;
  }, [socket, user]);  
  
  

  //leave room

  const leaveRoom = useCallback((roomId) => {
    if (!socket) {
      return false;
    }
    socket.emit('leave-room', {
      callId: roomId,
      user: user
    });
    return true;
  }, [socket, user]);


  // Send message

  const sendMessage = useCallback((roomId, message) => {
    if (!socket || !socket.connected) {
      console.warn('⚠️ Cannot send message: Socket not connected');
      return false;
    }

    console.log('💬 Sending message to room:', roomId);
    socket.emit('chat-message', {
      callId: roomId,
      user: user.email,
      message: message,
      timestamp: new Date().toLocaleTimeString()
    });
    return true;
  }, [socket, user.email]);

  const sendAskedQuestion = useCallback((roomId, question, difficulty = 'medium') => {
    if (!socket || !socket.connected) {
      console.warn('⚠️ Cannot send asked question: Socket not connected');
      return false;
    }

    socket.emit('asked-question', {
      callId: roomId,
      question,
      difficulty,
      user: user?.email,
      timestamp: new Date().toLocaleTimeString(),
    });

    return true;
  }, [socket, user]);

  const sendCodeChange = useCallback((roomId, language, code) => {
    if (!socket || !socket.connected) {
      console.warn('⚠️ Cannot send code change: Socket not connected');
      return false;
    }

    socket.emit('code-change', {
      callId: roomId,
      user,
      language,
      code,
      
    });

    return true;
  }, [socket, user]);



  
  // Add event listener

  const addEventListener = useCallback((event, handler) => {
    if (socket) {
      socket.on(event, handler);
      return () => socket.off(event, handler);
    }
    return null;
  }, [socket]);

  const contextValue = useMemo(() => ({
    socket,
    isConnected,
    user,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendAskedQuestion,
    sendCodeChange,
    addEventListener
  }), [socket, isConnected, user, joinRoom, leaveRoom, sendMessage, sendAskedQuestion, sendCodeChange, addEventListener]);


  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );

}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    console.log('useSocket must be used within a SocketProvider');
    return null;
  }
  return context;
};


export default SocketContext;