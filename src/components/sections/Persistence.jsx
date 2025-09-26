import React from 'react';
import CloudCheckIcon from '../common/CloudCheckIcon';

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
};

export default Persistence;
