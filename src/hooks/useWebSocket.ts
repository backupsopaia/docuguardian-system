
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/modules/auth';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export const useWebSocket = (endpoint: string = '/ws') => {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    
    // WebSocket URL with auth token
    const wsUrl = `wss://${window.location.host}${endpoint}?token=${token}`;
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        setMessages(prev => [...prev, data]);
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    socketRef.current = socket;
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [endpoint, token, isAuthenticated]);
  
  // Send message
  const sendMessage = useCallback((data: WebSocketMessage) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [isConnected]);
  
  // Subscribe to channel
  const subscribe = useCallback((channel: string, params?: Record<string, any>) => {
    return sendMessage({
      type: 'SUBSCRIBE',
      channel,
      ...params
    });
  }, [sendMessage]);
  
  // Unsubscribe from channel
  const unsubscribe = useCallback((channel: string) => {
    return sendMessage({
      type: 'UNSUBSCRIBE',
      channel
    });
  }, [sendMessage]);
  
  return {
    isConnected,
    messages,
    sendMessage,
    subscribe,
    unsubscribe
  };
};
