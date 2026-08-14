import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const botResponses = {
  greeting: "Hi! I'm the Atyant Assistant. What would you like help with today?",
  confused:
    "Feeling confused about college choice? Tell me your stream and rank, and I'll suggest the best path for you!",
  rank: "Got it! Based on your profile, I'm preparing personalized recommendations. Check your email shortly!",
  default:
    "Thanks for that! We're preparing a detailed analysis for you. You'll get an email soon with college, branch, and career suggestions.",
};

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, from: 'bot', text: botResponses.greeting }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (msg) => {
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = botResponses.default;

      if (msg.toLowerCase().includes('confused') || msg.toLowerCase().includes('help')) {
        botReply = botResponses.confused;
      } else if (msg.toLowerCase().includes('rank') || msg.toLowerCase().includes('stream')) {
        botReply = botResponses.rank;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl overflow-hidden border border-emerald-100"
          >
            <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] px-4 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Atyant Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 bg-[#efeae2] space-y-3 flex flex-col">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 text-sm shadow-sm ${
                      msg.from === 'bot'
                        ? 'bg-white text-gray-900 border border-gray-200/50'
                        : 'bg-[#DCF8C6] text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-900 rounded-lg px-4 py-2 border border-gray-200/50 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t bg-white p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-[#128C7E]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-[#128C7E] text-white disabled:opacity-50 transition hover:bg-[#075E54]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
