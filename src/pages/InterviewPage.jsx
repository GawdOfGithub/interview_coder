import React, { useState, useEffect } from 'react';
import { Menu, Paperclip, Bot, User, SendHorizontal, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveTab,
    setExtractedName,
    setIsLoading,
    setError,
    setInterviewStarted,
    setCurrentCandidateId
} from '../store/slices/interviewSlice';
// ✅ 1. IMPORT `selectCandidateById` TO GET THE CURRENT CANDIDATE'S DATA
import { addCandidate, updateCandidateChatHistory, fetchAllCandidates, fetchCandidateScores, selectChatHistoryByCandidateId, selectCandidateById } from '../store/slices/candidatesSlice';
import { persistor } from '../store';
import { resetInterviewState } from '../store/slices/interviewSlice';
import { resetCandidatesState } from '../store/slices/candidatesSlice';



// --- Child Componentszz ---
const HeaderTabs = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.interview.activeTab);

    return (
        <div className="flex items-center space-x-2 pb-4 w-full">
            <button
                onClick={() => dispatch(setActiveTab('interviewee'))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'interviewee'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
                }`}
            >
                Interviewee
            </button>
            <button
                onClick={() => dispatch(setActiveTab('interviewer'))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'interviewer'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
                }`}
            >
                Interviewer
            </button>
        </div>
    );
};

const WindowFrame = ({ children, title }) => (
    <div className="bg-[#2d3748] bg-opacity-80 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl w-full mx-auto overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-300 font-semibold text-sm">{title}</div>
            <div className="flex items-center space-x-4 opacity-50">
                <Menu size={18} className="text-gray-400" />
            </div>
        </div>
        <main className="min-h-[70vh]">
            {children}
        </main>
    </div>
);

const UploadView = ({ onFileSelect, isLoading, error }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-300 p-6 md:p-10">
            <div className="bg-blue-500/10 p-6 rounded-full mb-8 border border-blue-500/20">
                <Bot className="w-20 h-20 text-blue-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Upload resume to get started</h2>
            <p className="text-gray-400 max-w-md mb-8">
                Our AI will analyze your resume to tailor a personalized interview experience for you.
            </p>
            {isLoading && <p className="text-blue-400 mt-4">Processing resume, please wait...</p>}
            {error && <p className="text-red-400 mt-4">Error: {error}</p>}
            <div>
                <label htmlFor="resume-upload" className={`w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Paperclip size={20} className="mr-3"/>
                    <span>{isLoading ? 'Uploading...' : 'Choose Your Resume'}</span>
                </label>
                <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={isLoading} />
                <p className="text-xs text-gray-500 mt-3">Supports: PDF, DOC, DOCX</p>
            </div>
        </div>
    );
};

const ChatView = ({ extractedName }) => {
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentCandidateId = useSelector((state) => state.interview.currentCandidateId);
    // ✅ 2. GET THE FULL CANDIDATE OBJECT, NOT JUST THE CHAT HISTORY
    const currentCandidate = useSelector((state) => selectCandidateById(state, currentCandidateId));
    const chatHistory = currentCandidate?.chatHistory || [];
    const chatEndRef = React.useRef(null);

    useEffect(() => {
        if (chatHistory.length === 0 && extractedName && currentCandidateId) {
            dispatch(updateCandidateChatHistory({
                candidateId: currentCandidateId,
                message: { sender: 'ai', text: `Hi ${extractedName}, all your details have been extracted. Please type "Start" to begin your interview.` }
            }));
        }
    }, [extractedName, currentCandidateId, dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = { sender: 'user', text: newMessage };
        dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: userMessage }));

        // ✅ 3. ADD REDIRECTION LOGIC HERE
        if (newMessage.trim().toLowerCase() === 'start') {
            // Check if the current candidate exists and has completed the quiz
            if (currentCandidate && currentCandidate.quizCompleted) {
                // If yes, navigate to their profile page
                navigate(`/profile/${currentCandidateId}`);
            } else {
                // If no, proceed to the quiz as normal
                dispatch(setInterviewStarted(true));
                navigate('/question');
            }
        } else {
            const aiPromptMessage = { sender: 'ai', text: "Please type 'Start' to begin the interview." };
            dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiPromptMessage }));
        }

        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[70vh] bg-[#1a202c]/50">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatHistory.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        {message.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                <Bot size={18} />
                            </div>
                        )}
                        <div className={`max-w-lg p-3 rounded-lg shadow-md ${
                            message.sender === 'ai' 
                            ? 'bg-gray-700 text-gray-200 rounded-bl-none' 
                            : 'bg-blue-600 text-white rounded-br-none'
                        }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        {message.sender === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
                <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type 'Start' to begin..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                        <SendHorizontal className="h-6 w-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

const DashboardView = () => {
    // ... (This component remains unchanged)
    const candidates = useSelector((state) => state.candidates.list);
    const candidatesStatus = useSelector((state) => state.candidates.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (candidatesStatus === 'idle') {
            dispatch(fetchAllCandidates());
        }
    }, [dispatch, candidatesStatus]);
    
    useEffect(() => {
        candidates.forEach(candidate => {
            if (candidate.id && candidate.score == null) {
                dispatch(fetchCandidateScores(candidate.id));
            }
        });
    }, [candidates, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => setIsRendered(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getScoreBadge = (score) => {
        if (score === null || score === undefined) {
            return <span className="text-gray-400">Pending</span>;
        }
        let colorClasses = '';
        if (score >= 80) {
            colorClasses = 'bg-green-500/20 text-green-400';
        } else if (score >= 50) {
            colorClasses = 'bg-yellow-500/20 text-yellow-400';
        } else {
            colorClasses = 'bg-red-500/20 text-red-400';
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClasses}`}>
                {score}%
            </span>
        );
    };

    return (
        <div className="text-white p-6 md:p-10">
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
                </div>
            </div>

            <div className="bg-[#1a202c]/50 rounded-lg overflow-hidden border border-gray-700/50 ">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-700/30">
                            <tr>
                                <th className="p-4 font-semibold tracking-wider">Name</th>
                                <th className="p-4 font-semibold tracking-wider text-center">Score</th>
                                <th className="p-4 font-semibold tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate, index) => (
                                <tr 
                                    key={candidate.id || candidate.candidateId} 
                                    className={`border-b border-gray-700/50 transition-all duration-500 ease-out hover:bg-gray-700/20 hover:shadow-lg hover:-translate-y-1 ${isRendered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
                                            <User size={16} />
                                        </div>
                                        {candidate.name}
                                    </td>
                                    <td className="p-4 text-center">
                                        {getScoreBadge(candidate.score)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => navigate(`/profile/${candidate.id || candidate.candidateId}`)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors"
                                        >
                                            View More
                                        </button>
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


// --- Main Page Component ---
export default function InterviewPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const { activeTab, extractedName, isLoading, error } = useSelector((state) => state.interview);
    const handleResumeUpload = async (file) => {
        await persistor.purge();
        dispatch(resetInterviewState());
        dispatch(resetCandidatesState());
    
        dispatch(setIsLoading(true));
        
        const formData = new FormData();
        formData.append('resume', file);
    
        try {
            const response = await fetch(`${apiUrl}/parse-resume`, {
                method: 'POST',
                body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
                const { name, candidateId, quizCompleted } = result.data;

                // ✅ 2. ADD THE NEW REDIRECTION LOGIC HERE
                if (quizCompleted) {
                    // If the quiz is already completed, navigate directly to the profile page.
                    // This skips the chat window entirely.
                    navigate(`/profile/${candidateId}`);
                } else {
                    // Otherwise, if the quiz isn't done, proceed with the normal flow
                    // to show the chat window.
                    dispatch(setExtractedName(name));
                    
                    const newCandidatePayload = { 
                        id: candidateId, 
                        name: name, 
                        score: null, 
                        aiSummary: null, 
                        chatHistory: [],
                        quizCompleted: quizCompleted
                    };
                    dispatch(addCandidate(newCandidatePayload));
                    dispatch(setCurrentCandidateId(candidateId));
                }
            } else {
                dispatch(setError(result.error || 'An unknown error occurred.'));
            }
        } catch (err) {
            dispatch(setError('Failed to connect to the server. Please ensure the backend is running.'));
            console.error('Error uploading resume:', err);
        } finally {
            dispatch(setIsLoading(false));
        }
    };


    const renderIntervieweeView = () => {
        if (extractedName) {
            return <ChatView extractedName={extractedName} />;
        }
        return <UploadView onFileSelect={handleResumeUpload} isLoading={isLoading} error={error} />;
    };
    
    const getTitle = () => {
        if (activeTab === 'interviewer') return "Interviewer Dashboard";
        if (extractedName) return "AI Interview Chat";
        return "AI Interview Assistant";
    };

    return (
        <div className="min-h-screen w-full bg-[#1a202c] font-sans text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
            
            <div className="z-10 w-full max-w-5xl">
                <HeaderTabs />
                <WindowFrame title={getTitle()}>
                    {activeTab === 'interviewee' ? renderIntervieweeView() : <DashboardView />}
                </WindowFrame>
            </div>
        </div>
    );
}