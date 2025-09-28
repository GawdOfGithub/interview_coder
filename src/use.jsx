import React, { useState } from 'react';
import { Search, Filter, Menu, MoreHorizontal, Paperclip, ChevronDown, User, Star } from 'lucide-react';

// Mock Data based on the image
const mockCandidates = [
  { name: 'Abu Jonson', score1: 92, score2: 72, aiSummary: 9.8 },
  { name: 'Setah Progress', score1: 78, score2: 88, aiSummary: 8.5 },
  { name: 'Tiola Skee', score1: 5, score2: 17, aiSummary: 1.8 },
  { name: 'OHMQ', score1: 6, score2: null, aiSummary: null },
  { name: 'Sarah Lee', score1: null, score2: null, aiSummary: null },
  { name: 'Al Sunidate', score1: 85, score2: 91, aiSummary: 9.2 },
  { name: 'David Chen', score1: 65, score2: 70, aiSummary: 6.9 },
];

const mockChat = [
  { sender: 'ai', text: 'Okay, we’re beginning a concept of lifting stats in React. Ready?' },
  { sender: 'user', text: 'Great! I’m keen to see some AI Interviewer. Please upload your phone number to begin.' },
  { sender: 'ai', text: 'Upload Your Resume (PDF/DOCX required)', isUpload: true },
  { sender: 'user', text: 'Great! I’ll send your phone number to begin.' },
];


// --- Components ---

const HeaderTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex items-center space-x-2 p-4">
    <button
      onClick={() => setActiveTab('chat')}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
        activeTab === 'chat'
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
      }`}
    >
      Interviewee (Chat)
    </button>
    <button
      onClick={() => setActiveTab('dashboard')}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
        activeTab === 'dashboard'
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
      }`}
    >
      Interviewer
    </button>
  </div>
);

const WindowFrame = ({ children, title }) => (
    <div className="bg-[#2d3748] bg-opacity-80 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl w-full max-w-6xl mx-auto overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-300 font-semibold text-sm">{title}</div>
            <div className="flex items-center space-x-4">
                <Menu size={18} className="text-gray-400" />
                <div className="w-px h-5 bg-gray-600"></div>
                <MoreHorizontal size={18} className="text-gray-400" />
            </div>
        </div>
        <div className="flex">
             <aside className="w-24 md:w-48 bg-[#1a202c]/30 p-4 border-r border-gray-700/50 hidden sm:block">
                <h2 className="text-white font-bold text-center sm:text-left transform sm:rotate-0 -rotate-90 sm:origin-top-left origin-center" style={{writingMode: 'vertical-rl'}}>
                  Interviewee (Chat)
                </h2>
            </aside>
            <main className="flex-1 p-2 sm:p-4 md:p-6 min-h-[70vh]">
                {children}
            </main>
        </div>
    </div>
);

const ChatView = () => (
    <div className="flex flex-col h-full max-h-[70vh] bg-[#1a202c]/50 rounded-lg p-4">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white">AI-Powered Practice & Feedback</h3>
                <p className="text-gray-400 text-sm">for Full Stack Developers</p>
            </div>
            {mockChat.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'ai' && (
                         <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                           <Star size={16} />
                         </div>
                    )}
                    <div className={`max-w-md p-3 rounded-lg ${
                        message.sender === 'ai' 
                        ? 'bg-gray-700 text-gray-200 rounded-bl-none' 
                        : 'bg-blue-600 text-white rounded-br-none'
                    }`}>
                        <p className="text-sm">{message.text}</p>
                        {message.isUpload && (
                            <div className="mt-4">
                                <label htmlFor="resume-upload" className="w-full cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center justify-center transition">
                                    <Paperclip size={16} className="mr-2"/>
                                    <span>Choose File</span>
                                </label>
                                <input id="resume-upload" type="file" className="hidden" />
                            </div>
                        )}
                    </div>
                     {message.sender === 'user' && (
                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
                            <User size={16} />
                         </div>
                    )}
                </div>
            ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    </div>
);

const DashboardView = () => {
  const [candidates] = useState(mockCandidates);

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Candidates</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-[#1a202c]/80 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="flex items-center gap-2 bg-[#1a202c]/80 border border-gray-600 rounded-lg py-2 px-4 hover:bg-gray-700 transition">
            <span>Sort By: Score</span>
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 bg-[#1a202c]/80 border border-gray-600 rounded-lg py-2 px-4 hover:bg-gray-700 transition">
            <Filter size={16} />
            <span>Filter: All</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1a202c]/50 rounded-lg overflow-hidden border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700/30">
              <tr>
                <th className="p-4 font-semibold tracking-wider">Name</th>
                <th className="p-4 font-semibold tracking-wider text-center">Score 1</th>
                <th className="p-4 font-semibold tracking-wider text-center">Score 2</th>
                <th className="p-4 font-semibold tracking-wider text-center">AI Summary</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
                       <User size={16} />
                    </div>
                    {candidate.name}
                  </td>
                  <td className="p-4 text-center">
                    {candidate.score1 !== null ? `${candidate.score1}%` : '-'}
                  </td>
                  <td className="p-4 text-center">
                     {candidate.score2 !== null ? `${candidate.score2}%` : '-'}
                  </td>
                  <td className="p-4 font-bold text-center">
                    {candidate.aiSummary !== null ? candidate.aiSummary : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen w-full bg-[#1a202c] font-sans text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        
        <div className="z-10 w-full">
            <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <WindowFrame title={activeTab === 'chat' ? 'Interviewee (Chat)' : 'Interviewer (Dashboard)'}>
                {activeTab === 'chat' ? <ChatView /> : <DashboardView />}
            </WindowFrame>
        </div>
    </div>
  );
}
