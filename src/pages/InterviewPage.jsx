import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    setExtractedName,
    setIsLoading,
    setError,
    setCurrentCandidateId
} from '../store/slices/interviewSlice';
import { addCandidate } from '../store/slices/candidatesSlice';
import { persistor } from '../store';
import { resetInterviewState } from '../store/slices/interviewSlice';
import { resetCandidatesState } from '../store/slices/candidatesSlice';
import HeaderTabs from '../components/interview/HeaderTabs';
import WindowFrame from '../components/interview/WindowFrame';
import UploadView from '../components/interview/UploadView';
import ChatView from '../components/interview/ChatView';
import DashboardView from '../components/interview/DashboardView';

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
            const response = await fetch("https://interview-coder-1.onrender.com/parse-resume", {
                method: 'POST',
                body: formData,
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                // If the server returns an error, we throw it to be caught by the catch block
                throw new Error(result.error || 'An unknown error occurred.');
            }
    
            const { name, candidateId, quizCompleted } = result.data;

            if (quizCompleted) {
                // If the quiz is done, go straight to the profile page
                navigate(`/profile/${candidateId}`);
            } else {
                // Otherwise, show the chat window to start the quiz
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
        } catch (err) {
            // This block now catches network errors or errors thrown from a bad response
            dispatch(setError(err.message || 'Failed to connect to the server. Please ensure the backend is running.'));
            console.error('Error uploading resume:', err);
        } finally {
            // This will run regardless of success or failure
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