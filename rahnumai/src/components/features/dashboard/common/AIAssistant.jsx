import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useThemeGlobal } from "@/components/common/theme/ThemeProvider";

export default function AIAssistant({ accentColor }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your study assistant. How can I help?",
      isBot: true
    }
  ]);

  const { theme } = useThemeGlobal();
  const darkMode = theme === "dark";

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          text: "This is a simulated study response.",
          isBot: true
        }
      ]);
    }, 800);
  };

  return (
    <>
      {/* FAB Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
          style={{ background: accentColor }}
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 w-80 h-96 rounded-2xl shadow-xl flex flex-col border
          ${darkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-slate-200"}`}
        >
          {/* Header */}
          <div
            className="px-4 py-3 text-white flex justify-between items-center"
            style={{ background: accentColor }}
          >
            <div className="flex items-center space-x-2">
              <Bot size={18} />
              <span className="font-semibold">AI Assistant</span>
            </div>

            <button onClick={() => setOpen(false)}>
              <X className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] shadow
                  ${m.isBot
                    ? darkMode
                      ? "bg-orange-900/30 border border-orange-800 text-orange-200"
                      : "bg-orange-50 border border-orange-200"
                    : "bg-blue-500 text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center space-x-2">
            <input
              className={`flex-1 px-3 py-2 rounded-lg border outline-none
              ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"}`}
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-2 rounded-lg text-white"
              style={{ background: accentColor }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
