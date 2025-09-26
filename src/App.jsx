import React, { useState } from 'react';

// Helper: Icon Components (as SVGs)
const Logo = () => (
    <div className="flex items-center justify-center w-10 h-10 bg-black bg-opacity-10 rounded-lg border border-white border-opacity-20">
        <span className="font-bold text-white text-lg">AI</span>
    </div>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 w-5 h-5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const CloudCheckIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-400 mb-4">
        <path d="M17.5 22h.5c2.2 0 4-1.8 4-4s-1.8-4-4-4h-1.4c-.2-2.8-2.6-5-5.6-5c-2.3 0-4.3 1.4-5.2 3.3" />
        <path d="M7.5 22H8c2.2 0 4-1.8 4-4s-1.8-4-4-4H6.4C4 14 2 15.7 2 18c0 1.2.5 2.3 1.4 3.1" />
        <path d="m7 20 2 2 4-4" />
    </svg>
);

// Helper: Mock UI Components
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


// Page Sections
const Header = () => {
    const navLinks = ["Features", "For Interviewers", "Pricing", "Blog"];
    return (
        <header className="absolute top-0 left-0 right-0 z-30 py-6">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Logo />
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map(link => (
                        <a key={link} href="#" className="text-gray-300 hover:text-white transition-colors">{link}</a>
                    ))}
                </nav>
                <a href="#" className="border border-gray-600 hover:border-white text-white py-2 px-5 rounded-lg transition-colors">
                    Login
                </a>
            </div>
        </header>
    );
};

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050816]"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                            Unlock Your Potential. <br/> Interview Smarter
                        </h1>
                        <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8">
                            AI-Powered Practice & Feedback for Full Stack Developers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a href="#" className="bg-purple-600 text-white hover:bg-purple-700 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/20">
                                Start Free Interview
                            </a>
                            <a href="#" className=" bg-opacity-10 hover:bg-opacity-20 border border-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                                Explore Features
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <HeroIllustration />
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ title, features, mockUI }) => (
    <div className="group [perspective:1000px]">
        <div className="bg-gray-900 bg-opacity-40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 transition-all duration-500 transform-style-3d group-hover:border-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
                    <ul className="space-y-4">
                        {features.map(feature => (
                            <li key={feature} className="flex items-center text-gray-300">
                                <CheckCircleIcon />
                                <span className="ml-3">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="order-1 md:order-2 min-h-[15rem]">
                    {mockUI}
                </div>
            </div>
        </div>
    </div>
);

const Features = () => {
    const intervieweeFeatures = ["Practice with AI", "Get Instant Feedback", "Track Your Progress"];
    const interviewerFeatures = ["Manage Candidates", "AI Summaries", "Data-Driven Hiring"];

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-10">
                    <FeatureCard title="For Interviewees" features={intervieweeFeatures} mockUI={<IntervieweeMockUI />} />
                    <FeatureCard title="For Interviewers" features={interviewerFeatures} mockUI={<InterviewerMockUI />} />
                </div>
            </div>
        </section>
    );
};

const Persistence = () => {
    return (
        <section className="py-20 text-center">
             <div className="container mx-auto px-6">
                <div className="max-w-md mx-auto bg-gray-900 bg-opacity-40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 flex flex-col items-center">
                    <CloudCheckIcon />
                    <h3 className="text-2xl font-bold text-white mb-2">Persistence</h3>
                    <p className="text-gray-400">Never lose progress. Pick up where you left off.</p>
                </div>
            </div>
        </section>
    );
}

// Main App Component
export default function App() {
  return (
    <div className="bg-[#050816] min-h-screen font-sans overflow-hidden">
        {/* <!-- Background Glows --> */}
        
        <div className="relative z-10">
            <Header />
            <main>
                <Hero />
                <Features />
                <Persistence />
            </main>
        </div>
        
        {/* This style block is for animations and pseudo-classes not directly supported by Tailwind's className system. */}
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
          }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
          
          .bg-grid-pattern {
            background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 2rem 2rem;
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .group-hover\\:rotate-x-3:hover {
            transform: rotateX(3deg);
          }
           .group-hover\\:-rotate-y-3:hover {
            transform: rotateY(-3deg);
          }
           .group-hover\\:rotate-y-3:hover {
            transform: rotateY(3deg);
          }
        `}</style>
    </div>
  );
}


