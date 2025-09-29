import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, SendHorizontal, User } from 'lucide-react';
import { updateCandidateChatHistory } from '../../store/slices/candidatesSlice';
import { setInterviewStarted } from '../../store/slices/interviewSlice';

const ChatView = ({ chatMode, detailsToCollect, onDetailsCollected }) => {
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentCandidateId = useSelector((state) => state.interview.currentCandidateId);

    // We use local state for the chat history during the Q&A flow.
    // The Redux history is used as a base for the "start" mode.
    const [localChatHistory, setLocalChatHistory] = useState([]);
    const [collectedDetails, setCollectedDetails] = useState(detailsToCollect);
    const [questionIndex, setQuestionIndex] = useState(0);

    const chatEndRef = useRef(null);
    const currentField = chatMode === 'collect_details' ? detailsToCollect.missing[questionIndex] : null;

    useEffect(() => {
        // Sets the initial AI message based on the mode
        let initialMessage = {};
        if (chatMode === 'start_interview') {
            initialMessage = { sender: 'ai', text: `Hi ${detailsToCollect.name}, all your details have been extracted. Please type "Start" to begin your interview.` };
        } else if (chatMode === 'collect_details') {
            const firstMissingField = detailsToCollect.missing[0];
            initialMessage = { sender: 'ai', text: `Welcome! We need a few more details to get started. What is your full ${firstMissingField}?` };
        }
        setLocalChatHistory([initialMessage]);
    }, [chatMode, detailsToCollect]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localChatHistory]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = { sender: 'user', text: newMessage };
        // We always update the local chat history for immediate UI feedback
        setLocalChatHistory(prev => [...prev, userMessage]);
        
        // Also persist the user's message to the global Redux store
        dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: userMessage }));
        
        if (chatMode === 'start_interview') {
            if (newMessage.trim().toLowerCase() === 'start') {
                dispatch(setInterviewStarted(true));
                navigate('/question');
            } else {
                const aiPrompt = { sender: 'ai', text: "Please type 'Start' to begin the interview." };
                setLocalChatHistory(prev => [...prev, aiPrompt]);
                dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiPrompt }));
            }
        } else if (chatMode === 'collect_details') {
            const updatedDetails = { ...collectedDetails, [currentField]: newMessage };
            setCollectedDetails(updatedDetails);
            
            const nextQuestionIndex = questionIndex + 1;
            if (nextQuestionIndex < detailsToCollect.missing.length) {
                const nextField = detailsToCollect.missing[nextQuestionIndex];
                const aiMessage = { sender: 'ai', text: `Thanks! Now, what is your ${nextField}?` };
                setLocalChatHistory(prev => [...prev, aiMessage]);
                dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiMessage }));
                setQuestionIndex(nextQuestionIndex);
            } else {
                const aiMessage = { sender: 'ai', text: `Great, that's everything we need. Starting the quiz now!` };
                setLocalChatHistory(prev => [...prev, aiMessage]);
                dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiMessage }));
                setTimeout(() => {
                    onDetailsCollected(updatedDetails); // Send all collected data up to the parent
                }, 1500);
            }
        }
        setNewMessage('');
    };
    
    const getPlaceholder = () => {
        if (chatMode === 'collect_details') {
            if (!currentField) return "Please wait...";
            return `Type your ${currentField} here...`;
        }
        return "Type 'Start' to begin...";
    };

    return (
        <div className="flex flex-col h-[70vh] bg-[#1a202c]/50">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {localChatHistory.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        {message.sender === 'ai' && (<div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0"><Bot size={18} /></div>)}
                        <div className={`max-w-lg p-3 rounded-lg shadow-md ${message.sender === 'ai' ? 'bg-gray-700 text-gray-200 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        {message.sender === 'user' && (<div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0"><User size={16} /></div>)}
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
                        placeholder={getPlaceholder()}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={chatMode === 'collect_details' && !currentField}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50" disabled={chatMode === 'collect_details' && !currentField}>
                        <SendHorizontal className="h-6 w-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;