import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MessageCircle, BarChart2, ArrowLeft } from 'lucide-react';
import AiLogo from '../components/profile/AiLogo';
import AnswerCard from '../components/profile/AnswerCard';
import PerformanceChart from '../components/profile/PerformanceChart';
import Loading from '../components/common/Loading';
import ErrorNotice from '../components/common/ErrorNotice';
import { fetchCandidateById } from '../store/slices/candidatesSlice';
import { selectCandidateById } from '../store/slices/candidatesSlice';


// --- Main Profile Page Component ---
export default function ProfilePage() {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const candidate = useSelector((state) => selectCandidateById(state, candidateId));
    const candidateStatus = useSelector((state) => state.candidates.status);
    const error = useSelector((state) => state.candidates.error);

    useEffect(() => {
        if (!candidate || !candidate.aiSummary) {
            dispatch(fetchCandidateById(candidateId));
        }
    }, [candidateId, candidate, dispatch]);

    if (candidateStatus === 'loading' && !candidate) {
        return <Loading fullScreen message="Loading candidate profile..." />;
    }

    if (error) {
        return <ErrorNotice fullScreen title="Error loading profile" message={typeof error === 'string' ? error : 'An unknown error occurred.'} onRetry={() => navigate('/')} />;
    }

    if (!candidate) {
        return <ErrorNotice fullScreen title="No candidate data found" message={null} onRetry={() => navigate('/')} />;
    }

    const { name, email, phone, aiSummary, chatHistory, score } = candidate;

    const questionsAndAnswers = [];
    if (chatHistory) {
        for (let i = 0; i < chatHistory.length; i += 2) {
            const questionChat = chatHistory[i];
            const answerChat = chatHistory[i + 1];

            if (questionChat?.sender === 'ai' && answerChat?.sender === 'user') {
                const yourAnswer = (answerChat.text.match(/Your Answer: ([^\n]+)/) || [])[1]?.trim() || answerChat.yourAnswer || 'N/A';
                const isCorrect = (answerChat.text.match(/Correct: (Yes|No)/) || [])[1] === 'Yes' || answerChat.isCorrect || false;
                const originalAnswer = (answerChat.text.match(/Correct Answer: ([^\n]+)/) || [])[1]?.trim() || answerChat.originalAnswer || 'N/A';
                
                questionsAndAnswers.push({
                    id: i / 2,
                    question: questionChat.text,
                    yourAnswer,
                    originalAnswer,
                    isCorrect,
                });
            }
        }
    }

    const totalQuestions = questionsAndAnswers.length;
    const correctAnswers = questionsAndAnswers.filter(q => q.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const finalScore = score ?? 0;

    return (
        <div className="min-h-screen w-full bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50"></div>
            
            <main className="relative max-w-7xl mx-auto z-10">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 mb-6 text-slate-400 hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <AiLogo />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-100">Performance Report</h1>
                            <p className="text-slate-400">Generated on {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right text-slate-300 text-sm border-l-2 border-slate-700 pl-4 sm:pl-6">
                        <p className="font-medium">{name}</p>
                        <p>{email}</p>
                        <p>{phone}</p>
                    </div>
                </header>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-6 flex items-center gap-2">
                        <MessageCircle size={24} className="text-purple-400" /> Questions & Answers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {questionsAndAnswers.map((q) => (
                            <AnswerCard key={q.id} questionData={q} />
                        ))}
                    </div>
                </section>

                <section className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80">
                    <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-6 flex items-center gap-2">
                        <BarChart2 size={24} className="text-green-400" /> Performance Summary
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-4 text-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span className="text-slate-400">Total Questions:</span>
                                <span className="font-bold text-slate-200 ml-auto">{totalQuestions}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-slate-400">Correct Answers:</span>
                                <span className="font-bold text-slate-200 ml-auto">{correctAnswers}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <span className="text-slate-400">Incorrect Answers:</span>
                                <span className="font-bold text-slate-200 ml-auto">{incorrectAnswers}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-700">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                                <span className="text-slate-400 font-semibold">Final Score:</span>
                                <span className="font-bold text-2xl text-slate-100 ml-auto">{finalScore}%</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                            <PerformanceChart correct={correctAnswers} incorrect={incorrectAnswers} />
                            <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-4">AI-Generated Summary</h3>
                            <p className="text-slate-300 leading-relaxed text-center">
                                {aiSummary || "AI summary is being generated..."}
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}