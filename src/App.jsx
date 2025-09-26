import React, { useState } from 'react';
import Logo from './components/common/Logo';
import CheckCircleIcon from './components/common/CheckCircleIcon';
import CloudCheckIcon from './components/common/CloudCheckIcon';
import IntervieweeMockUI from './components/features/IntervieweeMockUI';
import InterviewerMockUI from './components/features/InterviewerMockUI';
import HeroIllustration from './components/illustrations/HeroIllustration';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import FeatureCard from './components/features/FeatureCard';
import Features from './components/sections/Features';
import Persistence from './components/sections/Persistence';

// Helper: Mock UI Components



// Page Sections

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
        
    </div>
  );
}


