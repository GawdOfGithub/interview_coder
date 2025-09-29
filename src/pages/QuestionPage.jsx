import React, {useState, useEffect, useMemo, useCallback } from 'react';
import { MoreHorizontal, RefreshCw, Pause, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { DUMMY_FULLSTACK_MCQS } from '../components/question/dummyMcqs';
import MCQView from '../components/question/MCQView';
import CircularTimer from '../components/question/CircularTimer';
import WelcomeBackModal from '../components/question/WelcomeBackModal';
import QuizSuccessScreen from '../components/question/QuizSuccessScreen';
import Loading from '../components/common/Loading';
import ErrorNotice from '../components/common/ErrorNotice';


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
                const response = await fetch('https://interview-coder-1.onrender.com/questions?limit=5');
                if (!response.ok) {
                    throw new Error(`Failed to fetch questions. Server responded with ${response.status}.`);
                }
                const data = await response.json();
                const normalized = Array.isArray(data) ? data : [];
                const source = normalized.length > 0 ? normalized : DUMMY_FULLSTACK_MCQS;
                const questionsWithTime = source.map(q => ({ ...q, timeLimit: q.timeLimit ?? 60 }));
                dispatch(setQuizQuestions(questionsWithTime));
                if (questionsWithTime.length > 0) {
                    dispatch(setTimeLeft(questionsWithTime[0].timeLimit));
                }
            } catch (err) {
                console.error('Error fetching quiz questions:', err);
                // Fallback to dummy questions when API fails
                const questionsWithTime = DUMMY_FULLSTACK_MCQS.map(q => ({ ...q, timeLimit: q.timeLimit ?? 60 }));
                dispatch(setQuizQuestions(questionsWithTime));
                if (questionsWithTime.length > 0) {
                    dispatch(setTimeLeft(questionsWithTime[0].timeLimit));
                }
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
                    const response = await fetch('https://interview-coder-1.onrender.com/submit-quiz', {
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

                    const summaryResponse = await fetch('https://interview-coder-1.onrender.com/generate-summary', {
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
        return <ErrorNotice fullScreen title="An Error Occurred" message={error} onRetry={handleTryAgain} />;
    }
    
    if (loadingQuestions || (!currentQuestion && !quizFinished)) {
        return <Loading fullScreen message="Loading Questions..." />;
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
                        <MCQView
                            currentQuestionIndex={currentQuestionIndex}
                            totalQuestions={quizQuestions.length}
                            question={currentQuestion}
                            options={currentQuestion.options}
                            selectedOption={selectedOption}
                            onSelectOption={(option) => dispatch(setSelectedOption(option))}
                            onSubmit={handleSubmit}
                        />
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