import React from 'react';

const HeroIllustration = () => (
    <div className="relative w-full max-w-lg h-auto">
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-2xl opacity-10 animate-pulse"></div>

        <div className="relative flex items-center justify-center">
            {/* <!-- Character --> */}
            <div className="relative z-10">
                <div className="w-56 h-72 bg-blue-400 rounded-t-full relative flex flex-col items-center justify-end overflow-hidden">
                    <div className="w-full h-1/2 bg-blue-600"></div>
                    {/* <!-- Face --> */}
                    <div className="absolute top-8 w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full relative">
                             {/* <!-- Hair --> */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-10 bg-gray-800 rounded-t-full">
                                <div className="absolute -bottom-2 left-0 w-8 h-4 bg-gray-800 rounded-br-full"></div>
                            </div>
                             {/* <!-- Eyes --> */}
                             <div className="absolute top-6 left-3 w-3 h-3 bg-gray-800 rounded-full"></div>
                             <div className="absolute top-6 right-3 w-3 h-3 bg-gray-800 rounded-full"></div>
                             {/* <!-- Smile --> */}
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-3 border-b-2 border-l-2 border-r-2 border-gray-800 rounded-b-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- UI Element --> */}
            <div className="absolute z-20 top-1/4 -right-10 w-48 bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 rounded-lg p-3 shadow-2xl">
                <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-300 mr-2"></div>
                    <div className="flex-1 h-3 bg-gray-600 rounded"></div>
                </div>
                <div className="h-1.5 bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-1.5 bg-gray-700 rounded w-full mb-2"></div>
                <div className="w-full h-4 bg-purple-500 rounded"></div>
            </div>
            {/* <!-- Floating Icons --> */}
            <div className="absolute z-0 top-10 left-0 w-12 h-12 bg-gray-700/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
             <div className="absolute z-0 bottom-5 right-0 w-16 h-16 bg-gray-700/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707M12 21v-1" /></svg>
            </div>
        </div>
    </div>
);

export default HeroIllustration;
