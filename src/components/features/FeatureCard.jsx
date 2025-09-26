import React from 'react';
import CheckCircleIcon from '../common/CheckCircleIcon';

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

export default FeatureCard;
