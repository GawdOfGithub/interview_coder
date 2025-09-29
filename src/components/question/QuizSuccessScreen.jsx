import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

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

export default QuizSuccessScreen;


