import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, BarChart2, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// --- Helper Components & Icons ---

// AI Logo Component
const AiLogo = () => (
  <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600">
    <span className="text-xl font-bold text-white tracking-wider">AI</span>
  </div>
);

// Correct Icon Component
const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Incorrect Icon Component
const XIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Question Card Component
const AnswerCard = ({ questionData }) => {
  const { question, yourAnswer, originalAnswer, isCorrect } = questionData;
  const cardBorderColor = isCorrect ? 'border-green-500/20' : 'border-red-500/20';
  const cardShadowColor = isCorrect ? 'shadow-green-500/10' : 'shadow-red-500/10';

  return (
    <div className={`bg-slate-800/60 p-6 rounded-xl border border-slate-700/80 shadow-lg ${cardShadowColor} transition-all hover:shadow-xl hover:border-slate-600`}>
      <h3 className="font-semibold text-lg text-slate-200 mb-4">{question}</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <p className="text-slate-400">Your Answer:</p>
          <p className="text-right text-slate-300 font-medium">{yourAnswer}</p>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-slate-400">Correct Answer:</p>
          <div className="flex items-center gap-2 text-right">
            {isCorrect ? (
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <CheckIcon className="w-4 h-4" /> Correct
              </span>
            ) : (
               <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
                <XIcon className="w-4 h-4" /> Incorrect
              </span>
            )}
            <p className="text-slate-300 font-medium">{originalAnswer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceChart = ({ correct, incorrect }) => {
  const data = [
    { name: 'Correct', value: correct },
    { name: 'Incorrect', value: incorrect },
  ];

  const COLORS = ['#10B981', '#EF4444']; // Green for correct, Red for incorrect

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// --- Main Profile Page Component ---
export default function ProfilePage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/candidates/${candidateId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCandidateData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateProfile();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading candidate profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-red-400 p-4">
        <h2 className="text-2xl mb-4">Error loading profile:</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <h2 className="text-2xl mb-4">No candidate data found.</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { name, email, phone, resumeText, aiSummary, chatHistory, score } = candidateData;

  console.log("Candidate Data:", candidateData);
  console.log("Chat History:", chatHistory);

  const questionsAndAnswers = [];
  if (chatHistory) {
    for (let i = 0; i < chatHistory.length; i += 2) {
      const questionChat = chatHistory[i];
      const answerChat = chatHistory[i + 1];

      if (questionChat && questionChat.sender === 'ai' && answerChat && answerChat.sender === 'user') {
        const question = questionChat.text;
        
        // Extract details from the user's answer text
        const yourAnswerMatch = answerChat.text.match(/Your Answer: ([^\n]+)/);
        const correctMatch = answerChat.text.match(/Correct: (Yes|No)/);
        const originalAnswerMatch = answerChat.text.match(/Correct Answer: ([^\n]+)/);

        const yourAnswer = yourAnswerMatch ? yourAnswerMatch[1].trim() : 'N/A';
        const isCorrect = correctMatch ? correctMatch[1] === 'Yes' : false;
        const originalAnswer = originalAnswerMatch ? originalAnswerMatch[1].trim() : 'N/A';

        questionsAndAnswers.push({
          id: i / 2,
          question,
          yourAnswer,
          originalAnswer,
          isCorrect,
        });
      }
    }
  }

  console.log("Filtered Questions and Answers:", questionsAndAnswers);

  // Calculate performance summary from the filtered questionsAndAnswers and overall score
  const totalQuestions = questionsAndAnswers.length;
  const correctAnswers = questionsAndAnswers.filter(q => q.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const finalScore = score !== null && score !== undefined ? score : 0;

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans text-white p-4 sm:p-6 lg:p-8">
       {/* Background decorative elements */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50"></div>
      
      <main className="relative max-w-7xl mx-auto z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        {/* --- Header Section --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <AiLogo />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Student Performance Report</h1>
              <p className="text-slate-400">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-slate-300 text-sm border-l-2 border-slate-700 pl-4 sm:pl-6">
            <p className="font-medium">{name}</p>
            <p>{email}</p>
            <p>{phone}</p>
          </div>
        </header>

        
        {/* --- Questions & Answers Section --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-6 flex items-center gap-2">
            <MessageCircle size={24} className="text-purple-400" /> Questions & Answers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionsAndAnswers.map((q, index) => (
              <AnswerCard key={index} questionData={q} />
            ))}
          </div>
        </section>

        {/* --- Performance Summary Section --- */}
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
                  {aiSummary || "AI summary not available yet."}
                </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
