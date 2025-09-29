import React, { useState } from 'react';
import Logo from './components/common/Logo';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import FeatureCard from './components/features/FeatureCard';
import Features from './components/sections/Features';
import Persistence from './components/sections/Persistence';



export default function App() {
  return (
    <div className="bg-[#050816] min-h-screen font-sans overflow-hidden">
       
        
        <div className="relative z-10">
            <Header />
            <main>
                <Hero />
                <Features />
                <Persistence />
            </main>
        </div>
        
        
    </div>
  );
}


