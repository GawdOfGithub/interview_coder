import React from 'react';
import HeroIllustration from '../illustrations/HeroIllustration';
import { Link } from 'react-router';

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
                            <Link to="/interview" className="bg-purple-600 text-white hover:bg-purple-700 text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/20">
                                Start Free Interview
                            </Link>
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

export default Hero;
