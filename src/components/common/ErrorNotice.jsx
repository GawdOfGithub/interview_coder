import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PixelErrorIcon = () => (
	<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<motion.path
			d="M20 20L80 80M20 80L80 20"
			stroke="#EF4444"
			strokeWidth="10"
			strokeLinecap="round"
			initial={{ pathLength: 0, opacity: 0 }}
			animate={{ pathLength: 1, opacity: 1 }}
			transition={{ duration: 0.8, ease: 'easeOut' }}
		/>
	</svg>
);

const GleamIcon = () => (
	<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
		<motion.path
			d="M20 0L22.4497 17.5503L40 20L22.4497 22.4497L20 40L17.5503 22.4497L0 20L17.5503 17.5503L20 0Z"
			fill="#A78BFA"
			initial={{ opacity: 0.5, scale: 0.9 }}
			animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1, 0.9] }}
			transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
		/>
	</svg>
);

const ErrorNotice = ({ title = 'ERROR', message = "Oops! Something went wrong.", onRetry, fullScreen = true, actionText = 'Return to Home Base' }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onRetry) {
            onRetry();
        } else {
            navigate('/');
        }
    };
    return (
		<div className={`relative flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[300px]'} w-full bg-[#0d0c22] font-sans overflow-hidden`}>
			<div className="absolute top-1/2 left-1/2 w-[80vmin] h-[80vmin] bg-radial-gradient from-red-900/40 to-transparent -translate-x-1/2 -translate-y-1/2"></div>
			<div className="relative z-10 flex flex-col items-center justify-center">
				<motion.div className="relative w-56 h-56 flex items-center justify-center rounded-full border-2 border-red-500/50" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
					<PixelErrorIcon />
					<motion.div className="absolute w-full h-full rounded-full border-2 border-red-500 opacity-70" animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
				</motion.div>
				<div className="text-center mt-8">
					<motion.h1 className="text-4xl font-bold text-red-500 tracking-[0.1em]" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}>
						{title}
					</motion.h1>
					<motion.p className="text-slate-300 mt-4 text-lg max-w-md" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}>
						{message}
					</motion.p>
                    <motion.button className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }} onClick={handleClick}>
						{actionText}
					</motion.button>
				</div>
			</div>
			<div className="absolute bottom-8 right-8 z-10">
				<GleamIcon />
			</div>
		</div>
	);
};

export default ErrorNotice;


