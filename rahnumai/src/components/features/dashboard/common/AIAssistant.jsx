import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Brain, BookOpen, Loader2 } from "lucide-react";
import { useThemeGlobal } from "@/components/common/theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant({ roleColor }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI study assistant. I can help with course materials, assignments, explanations, and personalized learning guidance. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      type: "welcome"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const { theme } = useThemeGlobal();
  const darkMode = theme === "dark";
  const accentColor = roleColor?.primary || "#f39c12";

  // Student data context (simulated - in real app, this would come from your backend)
  const studentData = {
    courses: ["Mathematics", "Computer Science", "Physics"],
    currentAssignments: [
      { subject: "Mathematics", due: "2024-01-15", topic: "Calculus" },
      { subject: "Computer Science", due: "2024-01-20", topic: "Data Structures" }
    ],
    performance: {
      mathematics: 85,
      computerScience: 92,
      physics: 78
    },
    learningStyle: "visual", // Could be visual, auditory, kinesthetic
    weakAreas: ["Quantum Mechanics", "Algorithm Complexity"]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hardcoded AI responses for design testing
  const getAIResponse = async (userMessage) => {
    setIsLoading(true);
    setThinking(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Keyword-based hardcoded responses
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('math') || lowerMessage.includes('calculus')) {
      return "Based on your performance (85% in Mathematics), I recommend focusing on practice problems. For calculus, try visualizing graphs and using step-by-step approaches. Would you like me to explain any specific calculus concept?";
    } else if (lowerMessage.includes('computer') || lowerMessage.includes('programming') || lowerMessage.includes('code')) {
      return "Your Computer Science performance is excellent (92%)! For data structures, consider creating visual diagrams to better understand algorithms. I can help you with programming concepts or review your current assignment on Data Structures.";
    } else if (lowerMessage.includes('physics') || lowerMessage.includes('quantum')) {
      return "I see Physics is an area for improvement (78%). For quantum mechanics, try watching explanatory videos and working through conceptual problems first. Your visual learning style might benefit from diagrams and simulations.";
    } else if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
      return "I can help with your assignments! You have Mathematics (Calculus) due Jan 15 and Computer Science (Data Structures) due Jan 20. Which assignment would you like to focus on?";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
      return "As a visual learner, I recommend using mind maps, diagrams, and color-coded notes. Based on your performance, focusing on Physics concepts would be most beneficial. Want me to suggest specific study techniques?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! I can assist with:\n• Course material explanations\n• Assignment guidance\n• Study strategies\n• Concept reviews\n• Performance analysis\nWhat specific area do you need help with?";
    } else {
      return "I understand you're asking about: \"" + userMessage + "\". As your AI study assistant, I can provide personalized help based on your courses and learning style. Could you tell me more about what you'd like to learn or which subject you need help with?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const aiResponse = await getAIResponse(input);
    
    const botMsg = {
      id: Date.now() + 1,
      text: aiResponse,
      isBot: true,
      timestamp: new Date(),
      type: "response"
    };
    
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
    setThinking(false);
  };

  // Quick action suggestions
  const quickActions = [
    { 
      icon: BookOpen, 
      text: "Help with assignment", 
      prompt: "Can you help me with my current assignment?" 
    },
    { 
      icon: Brain, 
      text: "Explain concept", 
      prompt: "Can you explain this concept to me?" 
    },
    { 
      icon: Sparkles, 
      text: "Study tips", 
      prompt: "What are good study strategies for visual learners?" 
    }
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
  };

  // Clear conversation
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI study assistant. I can help with course materials, assignments, explanations, and personalized learning guidance. How can I assist you today?",
        isBot: true,
        timestamp: new Date(),
        type: "welcome"
      }
    ]);
  };

  return (
    <>
      {/* Enhanced FAB Button with Animation - Mobile Responsive */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center text-white backdrop-blur-sm border-2 border-white/20 z-50"
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 8px 32px ${accentColor}40`
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              boxShadow: `0 12px 40px ${accentColor}60`
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
          >
            <MessageCircle size={20} className="sm:w-6 sm:h-6" />
            {/* Pulsing dot for new message indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window - Mobile Responsive */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-2xl shadow-2xl flex flex-col border backdrop-blur-xl z-50 overflow-hidden
            ${minimized ? 'w-72 sm:w-80 h-14 sm:h-16' : 'w-[calc(100vw-2rem)] sm:w-96 h-[400px] sm:h-[500px] max-w-sm sm:max-w-none'}
            ${darkMode 
              ? "bg-slate-900/95 border-slate-700/50 text-white" 
              : "bg-white/95 border-slate-200/50 text-slate-900"
            }`}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
          >
            {/* Enhanced Header */}
            <motion.div
              className="px-3 sm:px-4 py-2 sm:py-3 text-white flex justify-between items-center cursor-pointer"
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                boxShadow: `0 4px 20px ${accentColor}30`
              }}
              onClick={() => setMinimized(!minimized)}
              whileHover={{ opacity: 0.9 }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <Bot size={18} className="sm:w-5 sm:h-5" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <span className="font-semibold text-sm sm:text-base">AI Study Assistant</span>
                  {!minimized && (
                    <motion.p 
                      className="text-xs text-white/80 font-normal hidden sm:block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Demo Mode • Hardcoded Responses
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinimized(!minimized);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {minimized ? '+' : '-'}
                </motion.button>
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X size={16} className="sm:w-4 sm:h-4" />
                </motion.button>
              </div>
            </motion.div>

            {!minimized && (
              <>
                {/* Quick Actions */}
                <motion.div 
                  className="p-2 sm:p-3 border-b border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-2 px-1 sm:px-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Quick actions:
                    </p>
                    <button 
                      onClick={clearChat}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      Clear chat
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuickAction(action.prompt)}
                        className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs font-medium transition-all
                          ${darkMode 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <action.icon size={10} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">{action.text}</span>
                        <span className="sm:hidden">{action.text.split(' ')[0]}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Messages Area */}
                <div className="flex-1 p-2 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[280px] sm:max-h-[380px]">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`flex ${message.isBot ? "flex-row" : "flex-row-reverse"} items-end space-x-2 max-w-[90%] sm:max-w-[85%]`}>
                          {/* Avatar */}
                          <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.isBot 
                                ? "bg-gradient-to-br from-orange-500 to-amber-500" 
                                : "bg-gradient-to-br from-blue-500 to-cyan-500"
                            }`}
                          >
                            {message.isBot ? (
                              <Bot size={12} className="sm:w-4 sm:h-4 text-white" />
                            ) : (
                              <User size={12} className="sm:w-4 sm:h-4 text-white" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
                              message.isBot
                                ? darkMode
                                  ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"
                                  : "bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none"
                                : "bg-blue-500 text-white rounded-br-none"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.isBot 
                                ? darkMode ? "text-slate-400" : "text-slate-500"
                                : "text-blue-100"
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Thinking Indicator */}
                  <AnimatePresence>
                    {thinking && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin text-orange-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">AI is thinking...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <motion.div 
                  className="p-2 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="flex-1 relative">
                      <input
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border outline-none transition-all duration-200 backdrop-blur-sm text-sm sm:text-base
                          ${darkMode 
                            ? "bg-slate-800/80 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500" 
                            : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-orange-400"
                          }`}
                        placeholder="Ask about courses, assignments, or concepts..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={isLoading}
                      />
                      {isLoading && (
                        <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin text-orange-500" />
                        </div>
                      )}
                    </div>
                    <motion.button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      className={`p-2 sm:p-3 rounded-xl text-white transition-all duration-200 flex items-center justify-center
                        ${isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                      style={{ 
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                        boxShadow: `0 4px 15px ${accentColor}40`
                      }}
                      whileHover={!isLoading && input.trim() ? { scale: 1.05 } : {}}
                      whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
                    >
                      <Send size={16} className="sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center hidden sm:block">
                    Design Demo • Hardcoded responses for testing
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}