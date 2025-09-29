import React, { useEffect } from 'react';
import { X, Rocket } from 'lucide-react';

const WelcomeBackModal = ({ show, onClose }) => {
	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				onClose();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [show, onClose]);

	if (!show) {
		return null;
	}
	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
			<div className="relative bg-slate-900/70 border border-blue-500/30 rounded-2xl p-8 pt-12 text-center w-full max-w-sm shadow-2xl shadow-blue-500/10 transform animate-modal-pop">
				<div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15),transparent_40%)] -z-10" />
				<button 
					onClick={onClose} 
					className="absolute top-3 right-3 text-slate-500 hover:text-slate-200 transition-colors bg-slate-800/50 rounded-full p-1"
				>
					<X size={20} />
				</button>
				<div className="w-20 h-20 bg-blue-500/10 border-2 border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
					<Rocket size={40} className="text-blue-400" />
				</div>
				<h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-blue-400 mb-2">
					Welcome Back!
				</h2>
				<p className="text-slate-400 text-lg">
					Let's pick up where you left off.
				</p>
			</div>
		</div>
	);
};

export default WelcomeBackModal;


