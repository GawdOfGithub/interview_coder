import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    setIsLoading,
    setError,
    setCurrentCandidateId,
    setInterviewStarted
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


const QuizCompletedView = () => (
    <div className="flex items-center justify-center h-full min-h-[70vh] text-center text-gray-300 p-6 md:p-10">
        <h2 className="text-2xl font-semibold text-white">You have already completed the quiz.</h2>
    </div>
);

export default function InterviewPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeTab, isLoading, error } = useSelector((state) => state.interview);

    const [flowState, setFlowState] = useState('upload');
    const [candidateData, setCandidateData] = useState(null);

    const handleResumeUpload = async (file) => {
        await persistor.purge();
        dispatch(resetInterviewState());
        dispatch(resetCandidatesState());
        setFlowState('upload');
        dispatch(setIsLoading(true));
        
        const formData = new FormData();
        formData.append('resume', file);
    
        try {
            const response = await fetch("https://interview-coder-1.onrender.com/parse-resume", {
                method: 'POST',
                body: formData,
            });
    
            const result = await response.json();

            if (response.ok && result.data) {
                // --- PATH 1: Successful resume parse (200 OK) ---
                const { name, email, phone, candidateId, quizCompleted } = result.data;
                const details = { id: candidateId, name, email, phone, quizCompleted };
                
                dispatch(addCandidate({ ...details, score: null, aiSummary: null, chatHistory: [] }));
                dispatch(setCurrentCandidateId(candidateId));

                if (quizCompleted) {
                    setFlowState('quiz_completed');
                } else {
                    const missing = [];
                    if (!name) missing.push('name');
                    if (!email) missing.push('email');
                    if (!phone) missing.push('phone');

                    if (missing.length === 0) {
                        dispatch(setInterviewStarted(true));
                        navigate('/question');
                    } else {
                        setCandidateData({ ...details, missing });
                        setFlowState('collecting_details');
                    }
                }
            } else if (response.status === 400) {
                // --- PATH 2: Partial failure, manual entry required (400 Bad Request) ---
                console.warn('Server failed to parse resume, proceeding to manual entry.');
                
                // Since the server failed, we create a temporary candidate on the client
                const tempId = `temp_${Date.now()}`;
                const missingFields = ['name', 'email', 'phone']; // Ask for all details to be safe

                const details = { id: tempId, name: null, email: null, phone: null, quizCompleted: false, isTemporary: true };
                
                dispatch(addCandidate(details));
                dispatch(setCurrentCandidateId(tempId));
                setCandidateData({ ...details, missing: missingFields });
                setFlowState('collecting_details');
            } else {
                // --- PATH 3: All other server errors ---
                throw new Error(result.error || `An unexpected error occurred. Status: ${response.status}`);
            }
        } catch (err) {
            dispatch(setError(err.message));
            console.error('Error uploading resume:', err);
        } finally {
            dispatch(setIsLoading(false));
        }
    };
    
    // ✅ --- This function is now updated to handle temporary candidates ---
    const handleDetailsCollected = async (collectedDetails) => {
        dispatch(setIsLoading(true));
        // Check if the candidate was temporary (created after a 400 error)
        if (collectedDetails.isTemporary) {
            console.log("Creating new candidate with manual details:", collectedDetails);
            try {
                // IMPORTANT: You will need a new API endpoint to create a candidate from manual data.
                const createResponse = await fetch("https://interview-coder-1.onrender.com/create-candidate", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name: collectedDetails.name, 
                        email: collectedDetails.email, 
                        phone: collectedDetails.phone 
                    }),
                });

                const createResult = await createResponse.json();
                if (!createResponse.ok) throw new Error(createResult.error || "Failed to create candidate profile.");
                
                // You can now proceed with the real data from the backend
                // dispatch(replaceTempCandidateInStore(collectedDetails.id, createResult.data));

                dispatch(setInterviewStarted(true));
                navigate('/question');

            } catch (err) {
                dispatch(setError(`Failed to create profile: ${err.message}`));
                setFlowState('upload'); // Go back to the upload screen on failure
            } finally {
                dispatch(setIsLoading(false));
            }
        } else {
            // This is the original logic for a candidate that was successfully parsed but had missing fields.
            console.log("Updating candidate with collected details:", collectedDetails);
            dispatch(addCandidate(collectedDetails)); 
            dispatch(setInterviewStarted(true));
            navigate('/question');
            dispatch(setIsLoading(false));
        }
    };

    const renderIntervieweeView = () => {
        // ... (This function remains unchanged)
        switch (flowState) {
            case 'quiz_completed':
                return <QuizCompletedView />;
            case 'collecting_details':
                return (
                    <ChatView 
                        chatMode="collect_details"
                        detailsToCollect={candidateData}
                        onDetailsCollected={handleDetailsCollected}
                    />
                );
            case 'upload':
            default:
                return <UploadView onFileSelect={handleResumeUpload} isLoading={isLoading} error={error} />;
        }
    };
    
    const getTitle = () => {
        // ... (This function remains unchanged)
        if (activeTab === 'interviewer') return "Interviewer Dashboard";
        if (flowState === 'collecting_details') return "Finalizing Details";
        if (flowState === 'quiz_completed') return "Interview Status";
        return "AI Interview Assistant";
    };

    return (
        <div className="min-h-screen w-full bg-[#1a202c] font-sans text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10">
                 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/></pattern><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="url(#smallGrid)"/><path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
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