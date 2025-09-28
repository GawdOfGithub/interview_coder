import React, { useEffect, useMemo, useCallback } from 'react';
import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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
    setError 
} from '../store/slices/interviewSlice';
import { updateCandidateScore, updateCandidateAiSummary } from '../store/slices/candidatesSlice';

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


// --- Main Interview UI Component ---
export default function QuestionPage() {
    // --- State Management ---
    const dispatch = useDispatch();
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
        error
    } = useSelector((state) => state.interview);

    const currentQuestion = useMemo(() => quizQuestions?.[currentQuestionIndex], [quizQuestions, currentQuestionIndex]);

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
    // ✅ 1. handleNextStep NOW resets the timer for the next question
    const handleNextStep = useCallback(() => {
      const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
      if (isLastQuestion) {
          dispatch(setQuizFinished(true));
      } else {
          const nextQuestionIndex = currentQuestionIndex + 1;
          const nextQuestion = quizQuestions[nextQuestionIndex];

          // Set state for the next question
          dispatch(setCurrentQuestionIndex(nextQuestionIndex));
          dispatch(setSelectedOption(null));
          
          // Reset the timer for the upcoming question
          if (nextQuestion) {
              dispatch(setTimeLeft(nextQuestion.timeLimit));
          }
      }
  }, [currentQuestionIndex, quizQuestions, dispatch]);
  
  const handleSubmit = useCallback(() => {
      // Guard against calls before questions are loaded
      if (!currentQuestion) return;
      
      const timeTaken = currentQuestion.timeLimit - timeLeft;
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      
      if (isCorrect) {
          dispatch(incrementScore());
      }
  
      dispatch(addAnswer({ 
          question: currentQuestion.question, 
          answer: selectedOption, 
          isCorrect, 
          timeTaken 
      }));
      
      // This will now correctly prepare for the next question
      handleNextStep();
  }, [selectedOption, currentQuestion, timeLeft, handleNextStep, dispatch]);
 
    // --- Effects for Timer Management ---
    useEffect(() => {
        if (quizFinished || loadingQuestions || !currentQuestion) {
            return;
        }
    
        const timerId = setInterval(() => {
            dispatch(decrementTime());
        }, 1000);
    
        return () => clearInterval(timerId);
    }, [quizFinished, loadingQuestions, currentQuestion, dispatch]); 
    
    useEffect(() => {
        if (!quizFinished && timeLeft <= 0 && !loadingQuestions) {
            handleSubmit(); 
        }
    }, [timeLeft, quizFinished, handleSubmit, loadingQuestions]);
 
    /*
        ✅ 3. The problematic useEffect has been completely removed.
        There is no longer a useEffect that depends on currentQuestionIndex to reset the timer.
    */

    // --- Derived State for Performance Metrics & Summary ---
    const performance = useMemo(() => {
        if (!quizFinished || quizQuestions.length === 0) return null;
        const accuracy = (score / quizQuestions.length) * 100;
        const totalTimeTaken = userAnswers.reduce((acc, ans) => acc + ans.timeTaken, 0);
        const avgTime = quizQuestions.length > 0 ? totalTimeTaken / quizQuestions.length : 0;
        let summaryText, summaryColor;
        if (accuracy >= 80) {
            summaryText = "High Performance! You have a strong grasp of the concepts.";
            summaryColor = "text-green-400";
        } else if (accuracy >= 50) {
            summaryText = "Average Performance. Good effort, with room for improvement.";
            summaryColor = "text-yellow-400";
        } else {
            summaryText = "Poor Performance. It looks like you need more practice on these topics.";
            summaryColor = "text-red-400";
        }
        return { accuracy, avgTime, summaryText, summaryColor };
    }, [quizFinished, score, userAnswers, quizQuestions.length]);

    // --- Backend Score Submission ---
    useEffect(() => {
        const submitScore = async () => {
            if (quizFinished && performance && currentCandidateId) {
                try {
                    const response = await fetch('http://localhost:3000/submit-quiz', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ candidateId: currentCandidateId, score: parseFloat(performance.accuracy.toFixed(0)) }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        dispatch(updateCandidateScore({ candidateId: currentCandidateId, scoreValue: parseFloat(performance.accuracy.toFixed(0)) }));
                        const summaryResponse = await fetch('http://localhost:3000/generate-summary', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                candidateId: currentCandidateId, 
                                performance: { 
                                    accuracy: performance.accuracy.toFixed(0), 
                                    avgTime: performance.avgTime.toFixed(1) 
                                }, 
                                userAnswers 
                            }),
                        });
                        const summaryResult = await summaryResponse.json();
                        if (summaryResponse.ok) {
                            dispatch(updateCandidateAiSummary({ candidateId: currentCandidateId, aiSummary: summaryResult.aiSummary }));
                        } else {
                            console.error('Error generating AI summary:', summaryResult.error);
                        }
                    } else {
                        console.error('Error submitting score to backend:', result.error);
                    }
                } catch (error) {
                    console.error('Network error submitting score:', error);
                }
            }
        };
        submitScore();
    }, [quizFinished, performance, currentCandidateId, userAnswers, dispatch]);
 
    // --- Event Handler for Restarting Quiz ---
    const handleTryAgain = () => {
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
            <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-600/50 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 -right-1/a w-96 h-96 bg-purple-600/50 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
 
            <div className="w-full max-w-6xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 grid md:grid-cols-2 gap-12 z-10">
                
                {/* Left Side: Question or Results */}
                <div className="flex flex-col justify-center">
                    {!quizFinished ? (
                        <>
                            <div className="flex justify-between items-baseline">
                                <p className="text-lg font-semibold text-blue-400 mb-2">Question {currentQuestionIndex + 1}/{quizQuestions.length}</p>
                                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                                    currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                    {currentQuestion.difficulty}
                                </span>
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
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">Quiz Completed!</h2>
                            {performance && (
                                <p className={`text-lg font-semibold mb-2 ${performance.summaryColor}`}>{performance.summaryText}</p>
                            )}
                            <p className="text-slate-300 text-md mb-8">Review your performance on the right.</p>
                            <button onClick={handleTryAgain} className="flex items-center justify-center gap-2 mx-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
                                <RefreshCw size={18} />
                                Try Again
                            </button>
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
                                <p>Accuracy: <span className="font-bold text-2xl text-cyan-400">{performance ? `${performance.accuracy.toFixed(0)}%` : '--%'}</span></p>
                                <p>Avg. Time / Q: <span className="font-bold text-2xl text-cyan-400">{performance ? `${performance.avgTime.toFixed(1)}s` : '--s'}</span></p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-red-600/20 border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-600/40 transition-colors duration-300">
                            End Interview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}