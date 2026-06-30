import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image, User, Bot, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { db } from '../data/mockDatabase';

interface Message {
  id: string;
  sender: 'CITIZEN' | 'AGENT';
  text: string;
  image?: string;
  timestamp: string;
}

const CITIZEN_SUGGESTIONS = [
  'Where is the nearest shelter with water availability?',
  'First aid instructions for electrical water hazards',
  'Report blocked road due to landslide coordinates',
  'Translate current evacuation guidelines to Hindi'
];

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'AGENT',
      text: 'AI RESQ Help Desk online. Ask me about shelters, medical support, safe routes, or upload hazard photos for immediate autonomous routing. How can I assist you?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const simulateAgentReply = (userQuery: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let replyText = '';
      const query = userQuery.toLowerCase();

      if (query.includes('shelter')) {
        const shelters = db.getShelters();
        const active = shelters.filter(s => s.status === 'OPERATIONAL');
        replyText = `Based on your request, I located ${active.length} operational shelters. The closest is '${active[0]?.name}' which has ${active[0]?.capacity - active[0]?.occupancy} available beds and has ${active[0]?.foodStockDays} days of food inventory. Would you like me to map the safest route bypassing active hazards?`;
      } else if (query.includes('first aid') || query.includes('electrical')) {
        replyText = `CRITICAL SAFETY INFO:
1. Stay clear of standing water near downed lines.
2. If someone is shocked, DO NOT touch them directly. Turn off the main grid power immediately.
3. For trauma bleeding, apply direct pressure using sterile packs and elevate the wound. Saddle hospitals sadar-1 is on standby.`;
      } else if (query.includes('road') || query.includes('landslide')) {
        replyText = `URGENT INCIDENT LOGGED: Your hazard report regarding a blocked road has been uploaded to the Compliance Agent for verification and pushed to the Rescue Agent. Active rescue teams have been notified to re-route incoming assets.`;
      } else if (query.includes('hindi') || query.includes('translate')) {
        replyText = `निकासी चेतावनी: कोसी बेसिन निवासियों को तुरंत नजदीकी आश्रय स्थल (जिला इंडोर स्टेडियम) में स्थानांतरित होने की सलाह दी जाती है। अपने साथ दवाइयां और पानी रखें।`;
      } else {
        replyText = `Understood. Your request has been routed through the AI RESQ Information Retrieval Agent. Please remain calm. We have dispatched regional squads. If you are in immediate danger, click the emergency SOS button on your console.`;
      }

      // Word by word stream simulation
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'AGENT',
          text: replyText,
          timestamp: new Date().toISOString()
        }
      ]);
    }, 1500);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !attachedImage) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'CITIZEN',
      text: input,
      image: attachedImage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedImage(undefined);
    simulateAgentReply(userMessage.text);
  };

  const handleSuggestClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInput('Show me the nearest operational shelter capacity.');
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleSimulateImageUpload = () => {
    // Generate inline mock image base64 or placeholder style
    setAttachedImage('https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-950 text-slate-100">
      {/* Suggestions panel */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-wrap gap-2 items-center justify-center">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-2">Quick Prompts:</span>
        {CITIZEN_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestClick(s)}
            className="bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700/50 transition-all duration-150 flex items-center gap-1 hover:text-white"
          >
            {s}
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>
        ))}
      </div>

      {/* Messages stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isBot = msg.sender === 'AGENT';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
              <div className={`p-2.5 rounded-lg flex items-center justify-center h-9 w-9 flex-none border ${
                isBot ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className="space-y-2">
                <div className={`p-4 rounded-xl border leading-relaxed text-sm ${
                  isBot 
                    ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-sm' 
                    : 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                }`}>
                  <p className="whitespace-pre-line text-xs md:text-sm">{msg.text}</p>
                  {msg.image && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-700/50 max-w-xs">
                      <img src={msg.image} alt="Hazard Upload" className="object-cover w-full h-36" />
                      <div className="bg-slate-950 p-2 text-[10px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Simulated Citizen Hazard Image</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-[10px] text-slate-600 font-mono ${isBot ? 'text-left' : 'text-right'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="p-2.5 rounded-lg flex items-center justify-center h-9 w-9 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-1 text-slate-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-2 font-mono text-[10px]">Processing retrieval agents...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          {/* Simulated Image Upload */}
          <button
            type="button"
            onClick={handleSimulateImageUpload}
            className={`p-3 rounded-lg border transition-all duration-150 ${
              attachedImage 
                ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Attach disaster sector image"
          >
            {attachedImage ? <Check className="w-4 h-4" /> : <Image className="w-4 h-4" />}
          </button>

          {/* Voice Input */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-lg border transition-all duration-150 ${
              isRecording 
                ? 'bg-red-600/20 border-red-500/30 text-red-500 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Voice assistance"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Field */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isRecording ? 'Listening...' : 'Type a query or safety concern...'}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-slate-600"
          />

          {/* Send */}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg border border-indigo-700 transition-all duration-150"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChatAssistant;
