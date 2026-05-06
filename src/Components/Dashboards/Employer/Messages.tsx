import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message { id: number; text: string; sender: "employer" | "applicant"; time: string; }
interface Conversation { id: number; name: string; role: string; avatar: string; lastMessage: string; time: string; unread: number; online: boolean; }

const MOCK_CONVOS: Conversation[] = [
  { id: 1, name: "Alex Johnson", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?img=11", lastMessage: "Thanks for the opportunity!", time: "10:42 AM", unread: 2, online: true },
  { id: 2, name: "Maria Garcia", role: "UX Designer", avatar: "https://i.pravatar.cc/150?img=5", lastMessage: "Yes, 3 PM EST works perfect.", time: "Yesterday", unread: 0, online: false },
  { id: 3, name: "David Smith", role: "Backend Engineer", avatar: "https://i.pravatar.cc/150?img=12", lastMessage: "I have updated my portfolio link.", time: "Tue", unread: 0, online: true },
];

const MOCK_MSGS: Message[] = [
  { id: 1, text: "Hi Alex, thanks for applying to the Senior Frontend role.", sender: "employer", time: "10:30 AM" },
  { id: 2, text: "We were very impressed with your portfolio.", sender: "employer", time: "10:31 AM" },
  { id: 3, text: "Hello! Thank you so much for reaching out.", sender: "applicant", time: "10:35 AM" },
  { id: 4, text: "I'm glad you liked it.", sender: "applicant", time: "10:36 AM" },
  { id: 5, text: "Would you be available for a quick 15-min chat sometime this week?", sender: "employer", time: "10:40 AM" },
  { id: 6, text: "Thanks for the opportunity! I will review my schedule and get back to you today.", sender: "applicant", time: "10:42 AM" },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = (d: string, s = 14, fill = "none") => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
const Ico = {
  search: I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', 14),
  phone: I('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 16),
  video: I('<polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>', 16),
  more: I('<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>', 16),
  file: I('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>', 16),
  image: I('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', 16),
  send: I('<line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', 14, "currentColor")
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const iconBtn = (colorClass = "text-gray-500") => `bg-transparent border border-gray-200 rounded-md p-2 cursor-pointer flex items-center ${colorClass} hover:bg-gray-50 transition-colors`;

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Messages() {
  const [activeChat, setActiveChat] = useState<Conversation>(MOCK_CONVOS[0]);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();
  const filteredConvos = MOCK_CONVOS.filter(c => (!q || c.name.toLowerCase().includes(q)));

  return (
    <div className="font-sans bg-gray-50 h-screen flex flex-col relative">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-900">Messages</h1>
          <p className="m-0 text-sm text-gray-400">Communicate with candidates</p>
        </div>
      </div>

      <div className="flex-1 flex p-5 gap-4 overflow-hidden">
        
        {/* Left Pane */}
        <div className="w-80 shrink-0 bg-white border-[1.5px] border-gray-200 rounded-[10px] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{Ico.search}</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…"
                className="w-full py-2 pr-2.5 pl-8 border border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 outline-none font-sans focus:bg-white focus:border-gray-300 transition-colors" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.map(c => {
               const active = activeChat.id === c.id;
               return (
                 <button key={c.id} onClick={() => setActiveChat(c)} className={`w-full border-none border-b border-gray-200 px-4 py-3.5 cursor-pointer flex items-center gap-3 outline-none hover:bg-gray-50 transition-colors ${active ? "bg-gray-50" : "bg-white"}`}>
                   <div className="relative shrink-0">
                      <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-full object-cover border-[1.5px] border-gray-200" />
                      {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-600 border-2 border-white rounded-full" />}
                   </div>
                   <div className="flex-1 min-w-0 text-left">
                     <div className="flex justify-between mb-0.5">
                       <p className="m-0 text-[15px] font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{c.name}</p>
                       <span className="text-xs text-gray-400 font-mono">{c.time}</span>
                     </div>
                     <p className={`m-[0_0_4px] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis ${active ? "text-gray-900 font-semibold" : "text-gray-500 font-normal"}`}>{c.role}</p>
                     <p className="m-0 text-sm text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">{c.lastMessage}</p>
                   </div>
                   {c.unread > 0 && <div className="bg-gray-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{c.unread}</div>}
                 </button>
               );
            })}
          </div>
        </div>

        {/* Right Pane */}
        <div className="flex-1 bg-white border-[1.5px] border-gray-200 rounded-[10px] flex flex-col overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <div>
                <p className="m-0 text-base font-bold text-gray-900">{activeChat.name}</p>
                <p className="m-0 text-[13px] text-gray-500">{activeChat.role}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button className={iconBtn()}>{Ico.phone}</button>
              <button className={iconBtn()}>{Ico.video}</button>
              <button className={iconBtn()}>{Ico.more}</button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-gray-50 px-5 py-6 flex flex-col gap-4 overflow-y-auto">
             {MOCK_MSGS.map(msg => {
                const isMe = msg.sender === "employer";
                return (
                  <div key={msg.id} className={`max-w-[70%] flex flex-col gap-1 ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                    <div className={`px-3.5 py-2.5 text-[15px] leading-relaxed rounded-[10px] ${isMe ? "bg-gray-900 text-white border-none rounded-tr-[2px] rounded-tl-[10px]" : "bg-white text-gray-900 border-[1.5px] border-gray-200 rounded-tr-[10px] rounded-tl-[2px]"}`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{msg.time}</span>
                  </div>
                );
             })}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white shrink-0">
            <div className="flex items-end gap-3">
               <div className="flex gap-1.5 pb-1.5">
                 <button className="bg-transparent border-none text-gray-400 cursor-pointer p-1 hover:text-gray-600 transition-colors">{Ico.file}</button>
                 <button className="bg-transparent border-none text-gray-400 cursor-pointer p-1 hover:text-gray-600 transition-colors">{Ico.image}</button>
               </div>
               <div className="flex-1 relative">
                 <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type a message..." rows={1}
                  className="w-full px-3.5 py-3 border-[1.5px] border-gray-200 rounded-lg text-[15px] text-gray-900 bg-gray-50 outline-none font-sans resize-none focus:bg-white focus:border-gray-300 transition-colors placeholder-gray-400" />
               </div>
               <button className="bg-gray-900 text-white border-none cursor-pointer px-3.5 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                 {Ico.send}
               </button>
            </div>
          </div>

        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[1.5px] bg-white/10">
         <div className="bg-white/90 p-10 rounded-[30px] shadow-2xl border border-white/50 flex flex-col items-center gap-3 transform -rotate-1 hover:rotate-0 transition-transform duration-500 cursor-default">
            <div className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-2">
              Development
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
              Messaging <span className="text-gray-400">Coming Soon</span>
            </h2>
            <p className="text-gray-500 text-sm font-medium">Real-time candidate chat is currently in production.</p>
            <div className="w-16 h-1.5 bg-gray-900 rounded-full mt-4" />
         </div>
      </div>
    </div>
  );
}
