import React from 'react';
import { createPortal } from 'react-dom';
import { sendChatMessage } from '../utils/api';

const SESSION_KEY = 'atyant_chat_session_id';

const INITIAL_MESSAGES = [
  { id: 1, from: 'bot', text: 'Hey there! How can I help with your career decision today?' },
  {
    id: 2,
    from: 'bot',
    text: "To give you the best advice, what stream are you in, and do you have a recent exam rank you're working with?",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState(INITIAL_MESSAGES);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  // Persist sessionId across page reloads
  const sessionIdRef = React.useRef(
    typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) || undefined : undefined
  );

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(msg) {
    const text = msg.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // Optimistic "typing…" indicator
    const typingId = Date.now() + 1;
    setMessages((m) => [...m, { id: typingId, from: 'bot', text: '…', typing: true }]);

    try {
      const data = await sendChatMessage({
        message: text,
        sessionId: sessionIdRef.current,
      });

      // Persist the server-assigned sessionId
      if (data.sessionId) {
        sessionIdRef.current = data.sessionId;
        localStorage.setItem(SESSION_KEY, data.sessionId);
      }

      setMessages((m) =>
        m
          .filter((x) => x.id !== typingId)
          .concat({ id: Date.now() + 2, from: 'bot', text: data.reply || '(no reply)' })
      );
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((m) =>
        m
          .filter((x) => x.id !== typingId)
          .concat({
            id: Date.now() + 2,
            from: 'bot',
            text: "Sorry, I'm having trouble connecting right now. Please try again or reach us on WhatsApp.",
          })
      );
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <>
      {open ? (
        <div className="fixed top-0 right-0 z-[99999] h-screen w-full md:w-96 bg-white shadow-2xl border-l border-gray-100 flex flex-col transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="p-4 bg-[#09102b] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <div className="text-base font-bold tracking-wide">Atyant Assistant</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/70">AI Decision Support</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white text-3xl font-light p-2 leading-none transition-all hover:scale-110 active:scale-95"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Scrollable Messages Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] break-words shadow-sm ${
                    m.from === 'bot'
                      ? 'bg-white text-gray-900 border border-gray-100'
                      : 'bg-[#FF6B2B] text-white'
                  } ${m.typing ? 'animate-pulse' : ''}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6B2B] transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#FF6B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e05a1f] transition-colors shadow-md shadow-[#FF6B2B]/20 disabled:opacity-60"
            >
              {loading ? '…' : 'Send'}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 z-[99999] flex h-12 items-center gap-2 rounded-full bg-[#FF6B2B] px-4 text-sm font-semibold text-white shadow-2xl hover:bg-[#ff7a42] hover:scale-[1.03] active:scale-95 transition-all"
          aria-label="Open AI chat"
        >
          <svg className="h-4 w-4 text-white fill-current" viewBox="0 0 16 16">
            <path d="M5.5 0a.5.5 0 0 1 .5.5v2A.5.5 0 0 1 5.5 3h-2a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 3.5 0h2zm5 12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2zm-5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1zm9-9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1zm-4-1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3z" />
            <path d="M9.646 5.354a.5.5 0 0 0-.708 0L5.146 9.146a.5.5 0 1 0 .708.708L9.646 6.062a.5.5 0 0 0 0-.708z" />
          </svg>
          <span>Ask AI Assistant</span>
        </button>
      )}
    </>,
    document.body
  );
}
