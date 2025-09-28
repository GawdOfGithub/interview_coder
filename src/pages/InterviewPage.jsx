import React, { useState, useEffect } from 'react';
import { Menu, MoreHorizontal, Paperclip, Bot, User, SendHorizontal, Search, Filter, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveTab,
    setResumeFile,
    setExtractedName,
    setIsLoading,
    setError,
    setInterviewStarted,
    setCurrentCandidateId
} from '../store/slices/interviewSlice';
import { addCandidate, updateCandidateChatHistory, fetchCandidateScores, fetchAllCandidates, selectChatHistoryByCandidateId } from '../store/slices/candidatesSlice';

// --- Mock Data ---

// --- Components ---

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
    <div className="bg-[#2d3748] bg-opacity-80 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl w-100vw mx-auto overflow-hidden">
        {/* Window header */}
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
        {/* Window content */}
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
    const interviewStarted = useSelector((state) => state.interview.interviewStarted);
    const chatHistory = useSelector((state) => 
        selectChatHistoryByCandidateId(state, currentCandidateId) // Use memoized selector
    );

    React.useEffect(() => {
        console.log('ChatView mounted/updated. Current chat history:', chatHistory); // Debugging
        if (chatHistory.length === 0 && extractedName && currentCandidateId) {
            // Initialize chat history with the greeting message
            dispatch(updateCandidateChatHistory({
                candidateId: currentCandidateId,
                message: { sender: 'ai', text: `Hi ${extractedName}, all your details have been extracted. Please enter "Start" to begin your interview.` }
            }));
        }
    }, [chatHistory, currentCandidateId, extractedName, dispatch]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        console.log('handleSendMessage called:', { interviewStarted, extractedName, currentCandidateId, newMessage });

        const userMessage = { sender: 'user', text: newMessage };
        dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: userMessage }));

        if (!interviewStarted && newMessage.trim().toLowerCase() === 'start') {
            console.log('Attempting to start interview...');
            dispatch(setInterviewStarted(true));
            const aiStartMessage = { sender: 'ai', text: `Great! Let's begin. Based on your experience with React, can you explain the concept of "lifting state up"?` };
            dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiStartMessage }));
            navigate('/question');
        } else if (interviewStarted) {
            const aiResponse = { sender: 'ai', text: 'That\'s a great point. Can you elaborate on when you would choose that approach over using a state management library like Redux or Zustand?' };
            dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiResponse }));
        } else {
            const aiPromptMessage = { sender: 'ai', text: "Please enter 'Start' to begin the interview." };
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
            </div>
            <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
                <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your answer..."
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
    const candidates = useSelector((state) => state.candidates.list);
    const candidatesStatus = useSelector((state) => state.candidates.status); // Get status
    const dispatch = useDispatch(); 
    console.log('DashboardView candidates list (from Redux):', candidates); // Debugging
    console.log('DashboardView candidates status (from Redux):', candidatesStatus); // Debugging

    useEffect(() => {
        if (candidatesStatus === 'idle') { // Only fetch if not already loading or loaded
            console.log('DashboardView: Dispatching fetchAllCandidates on mount...'); 
            dispatch(fetchAllCandidates()); 
        }
    }, [dispatch, candidatesStatus]);

    useEffect(() => {
        console.log('DashboardView: Candidates list changed, fetching individual scores...', candidates.length);
        candidates.forEach(candidate => {
            if (candidate.id) { 
                console.log(`DashboardView: Fetching score for candidate ID: ${candidate.id}`); 
                dispatch(fetchCandidateScores(candidate.id));
            }
        });
    }, [candidates, dispatch]);

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

            <div className="bg-[#1a202c]/50 rounded-lg overflow-hidden border border-gray-700/50 ">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-700/30">
                            <tr>
                                <th className="p-4 font-semibold tracking-wider">Name</th>
                                <th className="p-4 font-semibold tracking-wider text-center">Score</th>
                                <th className="p-4 font-semibold tracking-wider text-center">AI Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate) => (
                                <tr key={candidate.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
                                            <User size={16} />
                                        </div>
                                        {candidate.name}
                                    </td>
                                    <td className="p-4 text-center">
                                        {console.log(`DashboardView: Rendering score for ${candidate.name} (ID: ${candidate.id}):`, candidate.score)} 
                                        {candidate.score !== null ? `${candidate.score}%` : '-'} 
                                    </td>
                                    <td className="p-4 font-bold text-center">
                                        {console.log(`DashboardView: Rendering AI summary for ${candidate.name} (ID: ${candidate.id}):`, candidate.aiSummary)} {/* Debugging */}
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

export default function InterviewPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [localResumeFile, setLocalResumeFile] = useState(null); // Local state for the File object

    const { activeTab, resumeFile, extractedName, isLoading, error, interviewStarted, currentCandidateId } = useSelector((state) => state.interview);

    const handleResumeUpload = async (file) => {
        dispatch(setIsLoading(true));
        dispatch(setError(null));
        dispatch(setExtractedName(null));
        // Store the actual File object locally
        setLocalResumeFile(file);
        // Only dispatch the filename to Redux (serializable)
        dispatch(setResumeFile(file.name)); 

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('http://localhost:3000/parse-resume', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                dispatch(setExtractedName(result.data.name));
                // Use the candidateId returned by the backend
                const newCandidateId = result.data.candidateId; 
                dispatch(addCandidate({ id: newCandidateId, name: result.data.name, score: null, aiSummary: null, chatHistory: [] }));
                dispatch(setCurrentCandidateId(newCandidateId));
            } else {
                dispatch(setError(result.error || 'An unknown error occurred.'));
                dispatch(setExtractedName(result.extractedData?.name || null));
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
        // Pass localResumeFile for upload logic if needed elsewhere, though formData uses it directly
        return <UploadView onFileSelect={handleResumeUpload} isLoading={isLoading} error={error} />;
    };
    
    const getTitle = () => {
        if(activeTab === 'interviewer') return "Interviewer Dashboard";
        if(localResumeFile) return "AI Interview Practice"; // Use local state for conditional rendering
        return "AI Interview Assistant";
    }

    return (
        <div className="min-h-screen w-full bg-[#1a202c] font-sans text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative grid */}
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
            
            {/* Main Content */}
            <div className="z-10 w-full max-w-5xl">
                <HeaderTabs />
                <WindowFrame title={getTitle()}>
                    {activeTab === 'interviewee' ? renderIntervieweeView() : <DashboardView />}
                </WindowFrame>
            </div>
        </div>
    );
}

