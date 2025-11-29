import { useState, useEffect, useRef } from 'react';
import { Send, Users, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import Card from '@/components/common/ui/cards/Card';

export default function CourseChatrooms() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Mathematics 101',
      code: 'MATH101',
      faculty: 'Dr. Sarah Johnson',
      participants: 45,
      unread: 3,
      lastMessage: 'Can someone help with calculus homework?',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      name: 'Computer Science',
      code: 'CS101',
      faculty: 'Prof. Michael Chen',
      participants: 32,
      unread: 0,
      lastMessage: 'New assignment posted in resources',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      name: 'Physics Fundamentals',
      code: 'PHY101',
      faculty: 'Dr. Emily Davis',
      participants: 28,
      unread: 1,
      lastMessage: 'Lab session moved to Friday',
      timestamp: '3 hours ago'
    }
  ]);

  const [activeCourse, setActiveCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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

  const loadCourseChat = (course) => {
    setActiveCourse(course);
    // Simulate loading messages
    const mockMessages = [
      {
        id: 1,
        text: 'Welcome to the course chat! Feel free to ask questions and help each other.',
        sender: 'System',
        timestamp: '10:00 AM',
        isOwn: false,
        isFaculty: false
      },
      {
        id: 2,
        text: 'Hello everyone! Remember the assignment is due this Friday.',
        sender: course.faculty,
        timestamp: '10:05 AM',
        isOwn: false,
        isFaculty: true
      },
      {
        id: 3,
        text: 'Can someone explain the last topic we covered?',
        sender: 'John Student',
        timestamp: '10:15 AM',
        isOwn: false,
        isFaculty: false
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeCourse) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      isFaculty: false
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-200px)] flex flex-col md:flex-row rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* Course List */}
      {(!activeCourse || !isMobile) && (
        <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${isMobile && activeCourse ? 'hidden' : 'flex'}`}>
          <div className="flex flex-col w-full">
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              {courses.map(course => (
                <div
                  key={course.id}
                  onClick={() => loadCourseChat(course)}
                  className={`p-3 sm:p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer transition-colors ${
                    activeCourse?.id === course.id 
                      ? 'bg-orange-50 dark:bg-orange-900/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {course.code.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-base">
                          {course.code}
                        </h3>
                        {course.unread > 0 && (
                          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-orange-500 text-white text-xs rounded-full">
                            {course.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {course.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                        {course.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                          <Users className="w-3 h-3" />
                          <span>{course.participants}</span>
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {course.timestamp}
                        </span>
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
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 ${isMobile && !activeCourse ? 'hidden' : 'flex'}`}>
        {activeCourse ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {isMobile && (
                    <button
                      onClick={() => setActiveCourse(null)}
                      className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg"
                    >
                      <span className="text-lg">←</span>
                    </button>
                  )}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {activeCourse.code.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-base">
                      {activeCourse.code} - {activeCourse.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                      {activeCourse.participants} participants • {activeCourse.faculty}
                    </p>
                  </div>
                </div>
                <button className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg">
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
                        : message.isFaculty
                        ? 'bg-purple-500 text-white rounded-bl-none'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {!message.isOwn && (
                      <p className={`text-xs font-medium mb-1 ${
                        message.isFaculty ? 'text-purple-100' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm sm:text-base">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn 
                        ? 'text-orange-100' 
                        : message.isFaculty
                        ? 'text-purple-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg">
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 sm:px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                />
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center p-4">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                {isMobile ? 'Select a course to start chatting' : 'Select a course from the list to start chatting'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}