import React from 'react';
import HeroIllustration from '../illustrations/HeroIllustration';
// Corrected: It's best practice to import Link from 'react-router-dom'
import { Link } from 'react-router-dom'; 

// Reusable Logo Component
const Logo = () => (
    <a href="/" className="flex items-center space-x-3">
        {/* The SVG is embedded as a src for cleanliness */}
        <img 
            src="data:image/svg+xml,<svg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='logoGradient' x1='0' y1='0' x2='64' y2='64' gradientUnits='userSpaceOnUse'><stop stop-color='%2338BDF8'/><stop offset='1' stop-color='%236366F1'/></linearGradient></defs><path d='M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32' stroke='url(%23logoGradient)' stroke-width='12' stroke-linecap='round'/><path d='M32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8' stroke='white' stroke-width='4' stroke-linecap='round' stroke-dasharray='2 8'/></svg>" 
            alt="Crisp Logo" 
            className="h-8 w-8"
        />
        <span className="text-white text-2xl font-bold tracking-wide">Crisp</span>
    </a>
);

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28">
            
            {/* --- Header with Logo --- */}
            <header className="absolute top-0 left-0 right-0 z-30">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <Logo />
                    {/* You can add navigation links or a button here if needed */}
                </div>
            </header>

            {/* --- Background Elements --- */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050816]"></div>
            
            {/* --- Main Hero Content --- */}
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
                            <Link to="/interview" className="bg-purple-600 text-white hover:bg-purple-700 font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/20">
                                Start Free Interview
                            </Link>
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

export default Hero;