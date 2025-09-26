import React from 'react';

const InterviewerMockUI = () => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full text-sm text-gray-300 transform transition-transform duration-500 group-hover:rotate-x-3 group-hover:rotate-y-3 group-hover:scale-105">
        <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-white">Randaist</p>
            <div className="flex space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            </div>
        </div>
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 font-semibold text-xs text-gray-400 px-2">
                <span>Candidate</span>
                <span className="text-right">Score</span>
            </div>
            {
                [
                    { name: 'Alexei Scores', score: '3.0/5.0', color: 'blue' },
                    { name: 'Marcus Seans', score: '5.0/5.0', color: 'green' },
                    { name: 'Merapo done lornhol', score: '3.0/5.0', color: 'yellow' },
                    { name: 'Elara Spare', score: '3.0/5.0', color: 'red' },
                    { name: 'Eleen test', score: '3.0/5.0', color: 'purple' },
                ].map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 items-center bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors">
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full bg-${item.color}-500 mr-2`}></div>
                            <span>{item.name}</span>
                        </div>
                        <div className="text-right font-mono text-white">{item.score}</div>
                        <div className="text-right text-gray-500">...</div>
                    </div>
                ))
            }
        </div>
    </div>
);

export default InterviewerMockUI;
