import React from 'react';
import { motion } from 'framer-motion';

const PixelAvatar = () => (
	<svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
		<motion.g initial={{ y: 0 }} animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
			<path d="M22 74H58V90H22V74Z" fill="#7C3AED" />
			<path d="M14 28H66V78H14V28Z" fill="#8B5CF6" />
			<path d="M26 50H36V58H26V50Z" fill="#C4B5FD" />
			<path d="M44 50H54V58H44V50Z" fill="#C4B5FD" />
			<path d="M32 64H48V70H32V64Z" fill="#C4B5FD" />
			<path d="M14 10H48V42H14V10Z" fill="#22D3EE" />
			<path d="M42 0H76V32H42V0Z" fill="#67E8F9" />
		</motion.g>
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

const Loading = ({ message = 'Unlocking your potential, one pixel at a time...', fullScreen = true }) => {
	const dotsContainerVariants = {
		initial: {},
		animate: { transition: { staggerChildren: 0.15 } },
	};

	const dotVariants = {
		initial: { y: '0%' },
		animate: { y: '-100%', transition: { duration: 0.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } },
	};

	return (
		<div className={`relative flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[300px]'} w-full bg-[#0d0c22] font-sans overflow-hidden`}>
			<div className="absolute top-1/2 left-1/2 w-[80vmin] h-[80vmin] bg-radial-gradient from-indigo-900/40 to-transparent -translate-x-1/2 -translate-y-1/2"></div>
			<div className="relative z-10 flex flex-col items-center justify-center">
				<div className="relative w-56 h-56 flex items-center justify-center">
					<motion.div className="absolute w-full h-full rounded-full border-2 border-cyan-400/20" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
						<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_theme(colors.cyan.400)]"></div>
					</motion.div>
					<motion.div className="absolute w-[85%] h-[85%] rounded-full border-t-2 border-b-2 border-cyan-400/70" animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
					<div className="z-10">
						<PixelAvatar />
					</div>
				</div>
				<div className="text-center mt-8">
					<h1 className="text-2xl font-semibold text-slate-100 tracking-[0.2em]">
						LOADING
						<motion.div variants={dotsContainerVariants} initial="initial" animate="animate" className="inline-flex">
							<motion.span variants={dotVariants}>.</motion.span>
							<motion.span variants={dotVariants}>.</motion.span>
							<motion.span variants={dotVariants}>.</motion.span>
						</motion.div>
					</h1>
					<p className="text-slate-400 mt-2">{message}</p>
				</div>
			</div>
			<div className="absolute bottom-8 right-8 z-10">
				<GleamIcon />
			</div>
		</div>
	);
};

export default Loading;


