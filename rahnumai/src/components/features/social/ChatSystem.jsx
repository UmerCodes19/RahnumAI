import { useState, useEffect, useRef } from 'react';
import { Send, Users, Search, MoreVertical } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';
import { useApi } from '@/contexts/ApiContext';

export default function ChatSystem() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Mathematics Study Group',
      type: 'group',
      lastMessage: 'Can someone help with calculus?',
      timestamp: '2 min ago',
      unread: 3,
      participants: 12
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      type: 'direct',
      lastMessage: 'Your assignment was excellent!',
      timestamp: '1 hour ago',
      unread: 0
    },
    {
      id: 3,
      name: 'Class CS101',
      type: 'class',
      lastMessage: 'New assignment posted',
      timestamp: '3 hours ago',
      unread: 1
    }
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: 'Thanks for your message! This is an automated reply.',
        sender: activeChat.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const loadChat = (chat) => {
    setActiveChat(chat);
    // Simulate loading messages
    const mockMessages = [
      {
        id: 1,
        text: 'Hello everyone!',
        sender: 'System',
        timestamp: '10:00 AM',
        isOwn: false
      },
      {
        id: 2,
        text: 'Welcome to the chat!',
        sender: chat.name,
        timestamp: '10:01 AM',
        isOwn: false
      }
    ];
    setMessages(mockMessages);
  };

  return (
  <div className={`h-[calc(100vh-140px)] sm:h-[calc(100vh-200px)] flex flex-col md:flex-row rounded-xl overflow-hidden border ${
    darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'
  }`}>
    {/* Chat List - Mobile Overlay */}
    {(!activeChat || !isMobile) && (
      <div className={`w-full md:w-80 border-r ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} ${isMobile && activeChat ? 'hidden' : 'flex'}`}>
        <div className="flex flex-col w-full">
          {/* Search Bar */}
          <div className={`p-3 sm:p-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                placeholder="Search chats..."
                className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  loadChat(chat);
                  if (isMobile) {
                    // On mobile, show only chat area after selection
                    // This would be handled by parent component state
                  }
                }}
                className={`p-3 sm:p-4 border-b cursor-pointer transition-colors ${
                  activeChat?.id === chat.id
                    ? darkMode
                      ? 'bg-orange-900/20 border-orange-800'
                      : 'bg-orange-50 border-orange-200'
                    : darkMode
                    ? 'border-slate-700 hover:bg-slate-700'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {chat.name}
                      </h3>
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm truncate mt-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {chat.type === 'group' && (
                        <span className={`flex items-center space-x-1 text-xs ${
                          darkMode ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                          <Users className="w-3 h-3" />
                          <span>{chat.participants}</span>
                        </span>
                      )}
                      {chat.unread > 0 && (
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-orange-500 text-white text-xs rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Chat Area */}
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-slate-800' : 'bg-white'} ${isMobile && !activeChat ? 'hidden' : 'flex'}`}>
      {activeChat ? (
        <>
          {/* Chat Header */}
          <div className={`p-3 sm:p-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {isMobile && (
                  <button
                    onClick={() => setActiveChat(null)}
                    className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg"
                  >
                    <span className="text-lg">←</span>
                  </button>
                )}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  {activeChat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeChat.name}
                  </h3>
                  <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activeChat.type === 'direct' ? 'Online' : `${activeChat.participants} participants`}
                  </p>
                </div>
              </div>
              <button className={`p-1 sm:p-2 rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
              }`}>
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
                    message.isOwn
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : darkMode
                      ? 'bg-slate-700 text-slate-100 rounded-bl-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  {!message.isOwn && (
                    <p className={`text-xs font-medium mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {message.sender}
                    </p>
                  )}
                  <p className="text-sm sm:text-base">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn 
                      ? 'text-orange-100' 
                      : darkMode ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className={`p-3 sm:p-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className={`flex-1 px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  newMessage.trim()
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
                    : darkMode
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <Users className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${
              darkMode ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {isMobile ? 'Select a chat to start messaging' : 'Select a chat from the list to start messaging'}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);
}