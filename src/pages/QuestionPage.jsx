import React, {useState, useEffect, useMemo, useCallback } from 'react';
import { MoreHorizontal, RefreshCw, Pause, Play, X,Rocket} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { 
    incrementScore, 
    addAnswer,
    decrementTime,
    resetInterviewState, 
    setCurrentQuestionIndex, 
    setSelectedOption, 
    setQuizFinished, 
    setQuizQuestions, 
    setTimeLeft, 
    setLoadingQuestions,
    setError,
    togglePause
    
} from '../store/slices/interviewSlice';
import { updateCandidateScore, updateCandidateAiSummary, clearCandidateAiSummary } from '../store/slices/candidatesSlice';

 const QuizSuccessScreen = ({ onViewResults }) => {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-white p-4">
                <div className="text-center transform transition-all animate-fade-in-down">
                    <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow-green">
                        <CheckCircle size={60} className="text-green-400 animate-check-pop-in" />
                    </div>
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-green-400 mb-3">
                        Quiz Submitted!
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
                        Your responses have been saved. Our AI is now analyzing your performance.
                    </p>
                    <button 
                        onClick={onViewResults} 
                        className="group flex items-center justify-center gap-3 py-3 px-8 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                        View My Results
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        );
    };



// --- Timer Component (Unchanged) ---
const CircularTimer = ({ timeLeft, totalTime }) => {
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = totalTime > 0 ? circumference - (timeLeft / totalTime) * circumference : circumference;
    const getTimerColor = () => {
        if (totalTime === 0) return 'stroke-cyan-400';
        const percentage = timeLeft / totalTime;
        if (percentage <= 0.25) return 'stroke-red-500';
        if (percentage <= 0.5) return 'stroke-yellow-500';
        return 'stroke-cyan-400';
    };
    return (
        <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                <circle stroke="#374151" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} r={normalizedRadius} cx={radius} cy={radius} className={`transition-all duration-500 ease-linear ${getTimerColor()}`} />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{timeLeft}</span>
                <span className="text-xs text-slate-400">seconds</span>
            </div>
        </div>
    );
};

const WelcomeBackModal = ({ show, onClose }) => {
    useEffect(() => {
        if (show) {
            // Automatically close the modal after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="relative bg-slate-900/70 border border-blue-500/30 rounded-2xl p-8 pt-12 text-center w-full max-w-sm shadow-2xl shadow-blue-500/10 transform animate-modal-pop">
                
                {/* Background Glow Effect */}
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15),transparent_40%)] -z-10" />
                
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-slate-500 hover:text-slate-200 transition-colors bg-slate-800/50 rounded-full p-1"
                >
                    <X size={20} />
                </button>
                
                <div className="w-20 h-20 bg-blue-500/10 border-2 border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                    <Rocket size={40} className="text-blue-400" />
                </div>
                
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-blue-400 mb-2">
                    Welcome Back!
                </h2>
                <p className="text-slate-400 text-lg">
                    Let's pick up where you left off.
                </p>
            </div>
        </div>
    );
};


// --- Main Interview UI Component ---
export default function QuestionPage() {
    // --- State Management ---
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { 
        currentQuestionIndex, 
        selectedOption, 
        quizFinished, 
        score, 
        userAnswers, 
        quizQuestions, 
        timeLeft, 
        loadingQuestions, 
        currentCandidateId,
        error,
        isPaused
    } = useSelector((state) => state.interview);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const currentQuestion = useMemo(() => quizQuestions?.[currentQuestionIndex], [quizQuestions, currentQuestionIndex]);
    const aiSummary = useSelector((state) => 
        state.candidates.list.find(c => c.id === currentCandidateId)?.aiSummary
    );

    // --- Fetch Questions from Backend ---
    useEffect(() => {
        const fetchQuestions = async () => {
            dispatch(setLoadingQuestions(true));
            dispatch(setError(null));
            try {
                const response = await fetch('http://localhost:3000/questions?limit=5');
                if (!response.ok) {
                    throw new Error(`Failed to fetch questions. Server responded with ${response.status}.`);
                }
                const data = await response.json();
                const questionsWithTime = data.map(q => ({ ...q, timeLimit: 60 }));
                dispatch(setQuizQuestions(questionsWithTime));
                if (questionsWithTime.length > 0) {
                    dispatch(setTimeLeft(questionsWithTime[0].timeLimit));
                }
            } catch (err) {
                console.error('Error fetching quiz questions:', err);
                dispatch(setError(err.message));
            } finally {
                dispatch(setLoadingQuestions(false));
            }
        };

        if (currentCandidateId && quizQuestions.length === 0 && !loadingQuestions && !error) {
            fetchQuestions();
        }
    }, [dispatch, quizQuestions.length, loadingQuestions, currentCandidateId, error]);

    // --- Submission Logic ---
    const handleNextStep = useCallback(() => {
        const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
        if (isLastQuestion) {
            dispatch(setQuizFinished(true));
        } else {
            const nextQuestionIndex = currentQuestionIndex + 1;
            const nextQuestion = quizQuestions[nextQuestionIndex];
            dispatch(setCurrentQuestionIndex(nextQuestionIndex));
            dispatch(setSelectedOption(null));
            if (nextQuestion) {
                dispatch(setTimeLeft(nextQuestion.timeLimit));
            }
        }
    }, [currentQuestionIndex, quizQuestions, dispatch]);
 
    const handleSubmit = useCallback(() => {
        if (!currentQuestion) return;
        
        const timeTaken = currentQuestion.timeLimit - timeLeft;
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            dispatch(incrementScore());
        }
 
        const userAnswers = { 
            question: currentQuestion.question, 
            answer: selectedOption, 
            correctAnswer: currentQuestion.correctAnswer, // Add correct answer
            isCorrect, 
            timeTaken 
        };
        dispatch(addAnswer(userAnswers));
        
        handleNextStep();
    }, [selectedOption, currentQuestion, timeLeft, handleNextStep, dispatch]);
    
    const handlePauseResume = () => {
        if (isPaused) {
            setShowWelcomeModal(true);
        }
        dispatch(togglePause());
    };

    // --- Effects for Timer Management ---
    useEffect(() => {
        // ✅ 4. MODIFIED: The timer now stops if the quiz is paused.
        if (quizFinished || loadingQuestions || !currentQuestion || isPaused) {
            return;
        }
        const timerId = setInterval(() => {
            dispatch(decrementTime());
        }, 1000);
        return () => clearInterval(timerId);
    }, [quizFinished, loadingQuestions, currentQuestion, isPaused, dispatch]);
    
    useEffect(() => {
        if (!quizFinished && timeLeft <= 0 && !loadingQuestions) {
            handleSubmit(); 
        }
    }, [timeLeft, quizFinished, handleSubmit, loadingQuestions]);

    useEffect(() => {
        const isReloadInMiddleOfQuiz = currentQuestionIndex > 0 || (currentQuestion && timeLeft < totalTime);
        if (isReloadInMiddleOfQuiz && !quizFinished) {
            setShowWelcomeModal(true);
        }
    }, []); 

    // --- Derived State for Performance Metrics & Summary ---
    const performance = useMemo(() => {
        if (!quizFinished || quizQuestions.length === 0) return null;
        const accuracy = (score / quizQuestions.length) * 100;
        const totalTimeTaken = userAnswers.reduce((acc, ans) => acc + ans.timeTaken, 0);
        const avgTime = quizQuestions.length > 0 ? totalTimeTaken / quizQuestions.length : 0;
        const summaryText = aiSummary || "Generating AI analysis...";
        let summaryColor;
        if (accuracy >= 80) {
            summaryColor = "text-green-400";
        } else if (accuracy >= 50) {
            summaryColor = "text-yellow-400";
        } else {
            summaryColor = "text-red-400";
        }
        return { accuracy, avgTime, summaryText, summaryColor };
    }, [quizFinished, score, userAnswers, quizQuestions.length, aiSummary]);

    const performanceMetrics = useMemo(() => {
        if (!quizFinished || quizQuestions.length === 0) return null;
        
        const accuracy = (score / quizQuestions.length) * 100;
        const totalTimeTaken = userAnswers.reduce((acc, ans) => acc + ans.timeTaken, 0);
        const avgTime = quizQuestions.length > 0 ? totalTimeTaken / quizQuestions.length : 0;
        
        return { accuracy, avgTime };
    }, [quizFinished, score, userAnswers, quizQuestions.length]);

    // --- Backend Score Submission ---
    useEffect(() => {
        const submitScore = async () => {
            if (quizFinished && performanceMetrics && currentCandidateId) {
                try {
                    // Submit score and user answers to the backend
                    const response = await fetch('http://localhost:3000/submit-quiz', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            candidateId: currentCandidateId, 
                            score: parseFloat(performanceMetrics.accuracy.toFixed(0)),
                            userAnswers: userAnswers, // Send the full userAnswers array
                        }),
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to submit score');
                    }
                    
                    dispatch(updateCandidateScore({ candidateId: currentCandidateId, scoreValue: parseFloat(performanceMetrics.accuracy.toFixed(0)) }));

                    const summaryResponse = await fetch('http://localhost:3000/generate-summary', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            candidateId: currentCandidateId,
                            performance: {
                                accuracy: performanceMetrics.accuracy.toFixed(0),
                                avgTime: performanceMetrics.avgTime.toFixed(1)
                            },
                            userAnswers: userAnswers // Also send to summary generation if needed
                        }),
                    });
                    const summaryResult = await summaryResponse.json();
                    if (summaryResponse.ok) {
                        dispatch(updateCandidateAiSummary({ candidateId: currentCandidateId, aiSummary: summaryResult.aiSummary }));
                    } else {
                        console.error('Error generating AI summary:', summaryResult.error);
                    }
                    
                    // Redirect to profile page after successful submission and summary generation
                    navigate(`/profile/${currentCandidateId}`);
                } catch (error) {
                    console.error('Network error during score submission:', error);
                    dispatch(setError(error.message));
                }
            }
        };
        submitScore();
    }, [quizFinished, performanceMetrics, currentCandidateId, userAnswers, dispatch]);
 
    // --- Event Handler for Restarting Quiz ---
    const handleTryAgain = () => {
        // ✅ 2. First, clear the old summary for the current candidate
        if (currentCandidateId) {
            dispatch(clearCandidateAiSummary(currentCandidateId));
        }
        
        // Then, reset the interview state to start the quiz again
        dispatch(resetInterviewState());
    };
    
    const totalTime = currentQuestion ? currentQuestion.timeLimit : 60;
 
    // --- Render Logic ---
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <h2 className="text-2xl text-red-400 mb-4">An Error Occurred</h2>
                <p className="text-slate-400 mb-6 text-center">{error}</p>
                <button onClick={handleTryAgain} className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all">
                    <RefreshCw size={18} />
                    Try Again
                </button>
            </div>
        );
    }
    
    if (loadingQuestions || (!currentQuestion && !quizFinished)) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">Loading Questions...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 relative overflow-hidden">
                        <WelcomeBackModal show={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />

            <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-600/50 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 -right-1/a w-96 h-96 bg-purple-600/50 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

            <div className="w-full max-w-6xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 grid md:grid-cols-2 gap-12 z-10">
                
                {/* Left Side: Question or Results */}
                <div className="flex flex-col justify-center">
                    {!quizFinished ? (
                        <>
                            <div className="flex justify-between items-baseline">
                                <p className="text-lg font-semibold text-blue-400 mb-2">Question {currentQuestionIndex + 1}/{quizQuestions.length}</p>
                                {currentQuestion.difficulty && <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                                    currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                    {currentQuestion.difficulty}
                                </span>}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 leading-tight my-8 min-h-[100px]">
                                {currentQuestion.question}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button key={index} onClick={() => dispatch(setSelectedOption(option))} className={`p-4 rounded-lg text-left transition-all duration-300 border-2 ${selectedOption === option ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'}`}>
                                        <span className={`font-mono mr-3 font-bold ${selectedOption === option ? 'text-white' : 'text-blue-400'}`}>{String.fromCharCode(65 + index)}</span>
                                        <span className="font-semibold">{option}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleSubmit} disabled={!selectedOption} className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                                Submit Answer
                            </button>
                        </>
                    ) : (
                        <div>
                        <QuizSuccessScreen onViewResults={() => navigate(`/profile/${currentCandidateId}`)} />
                      </div>
                      
                    )}
                </div>

                {/* Right Side: Info & Controls */}
                <div className="flex flex-col items-center justify-between bg-slate-900/70 p-6 rounded-xl border border-slate-700">
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/48" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-slate-600"/>
                            <div><h3 className="font-semibold text-white">AI Interviewer</h3><p className="text-sm text-green-400">Online</p></div>
                        </div>
                        <button className="text-slate-400 hover:text-white"><MoreHorizontal size={24} /></button>
                    </div>

                    {!quizFinished ? <CircularTimer timeLeft={timeLeft} totalTime={totalTime} /> : <div className="text-green-400 text-center my-auto"><h3 className="text-2xl font-bold">Finished!</h3></div>} 

                    <div className="w-full space-y-4">
                        <div className="bg-slate-800/80 p-4 rounded-lg">
                            <h4 className="font-semibold text-slate-200 mb-2">Your Performance</h4>
                            <div className="text-sm text-slate-400 space-y-2">
                                <p>Accuracy: <span className="font-bold text-2xl text-cyan-400">
                                    {(performanceMetrics && typeof performanceMetrics.accuracy === 'number') ? `${performanceMetrics.accuracy.toFixed(0)}%` : '--%'}
                                </span></p>
                                <p>Avg. Time / Q: <span className="font-bold text-2xl text-cyan-400">
                                    {(performanceMetrics && typeof performanceMetrics.avgTime === 'number') ? `${performanceMetrics.avgTime.toFixed(1)}s` : '--s'}
                                </span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handlePauseResume}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 font-bold rounded-lg hover:bg-yellow-600/40 transition-colors duration-300"
                            >
                                {isPaused ? <Play size={18}/> : <Pause size={18} />}
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button className="w-full py-3 bg-red-600/20 border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-600/40 transition-colors duration-300">
                                End Interview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
//refactor it later 