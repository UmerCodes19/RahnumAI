import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your studies today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "I understand your question about your studies. Let me help you with that. This is a simulated response from your AI learning assistant.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl z-40"
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)'
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-80 h-96 rounded-2xl shadow-2xl flex flex-col z-50 backdrop-blur-sm border transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-900/95 border-slate-700 text-white' 
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}>
          
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 rounded-t-2xl text-white"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)'
            }}
          >
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-semibold">Study Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}
                  >
                    {message.isBot ? (
                      <Bot size={16} className="text-white" />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isBot
                        ? darkMode
                          ? 'bg-orange-900/20 text-slate-200 border border-orange-800'
                          : 'bg-orange-50 text-slate-800 border border-orange-200'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot 
                        ? darkMode ? 'text-orange-400' : 'text-orange-600'
                        : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={`p-4 border-t transition-colors duration-300 ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your courses, assignments..."
                className={`flex-1 px-3 py-2 rounded-lg border bg-transparent placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
                  darkMode
                    ? 'border-slate-600 text-white placeholder-slate-400'
                    : 'border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white transition-all duration-300 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 shadow-md hover:shadow-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}