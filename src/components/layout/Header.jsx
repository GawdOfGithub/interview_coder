import React from 'react';
import Logo from '../common/Logo';

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

export default Header;
