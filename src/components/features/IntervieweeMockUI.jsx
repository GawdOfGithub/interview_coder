import React from 'react';

const IntervieweeMockUI = () => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full h-full transform transition-transform duration-500 group-hover:rotate-x-3 group-hover:-rotate-y-3 group-hover:scale-105">
        <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-sm mr-2">H</div>
            <div>
                <p className="font-bold text-white text-sm">HeadSmart</p>
                <div className="flex items-center text-xs text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                    Online
                </div>
            </div>
             <div className="flex-grow"></div>
            <div className="flex space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span>
            </div>
        </div>
        <div className="space-y-3">
            <div className="bg-gray-700 p-2 rounded-lg text-sm text-gray-300 max-w-[80%]">
                React hooks for class threats?
            </div>
            <div className="bg-purple-600 p-3 rounded-lg text-sm text-white ml-auto max-w-[90%]">
                Can you explain that in more detail, please? That's not a standard term.
            </div>
        </div>
    </div>
);

export default IntervieweeMockUI;
