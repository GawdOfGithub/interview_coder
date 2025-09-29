import React from 'react';
import { Menu } from 'lucide-react';

const WindowFrame = ({ children, title }) => (
	<div className="bg-[#2d3748] bg-opacity-80 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl w-full mx-auto overflow-hidden">
		<div className="flex items-center justify-between p-3 border-b border-gray-700/50">
			<div className="flex items-center space-x-2">
				<div className="w-3 h-3 bg-red-500 rounded-full"></div>
				<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
				<div className="w-3 h-3 bg-green-500 rounded-full"></div>
			</div>
			<div className="text-gray-300 font-semibold text-sm">{title}</div>
			<div className="flex items-center space-x-4 opacity-50">
				<Menu size={18} className="text-gray-400" />
			</div>
		</div>
		<main className="min-h-[70vh]">
			{children}
		</main>
	</div>
);

export default WindowFrame;


