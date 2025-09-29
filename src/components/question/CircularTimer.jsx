import React from 'react';

const CircularTimer = ({ timeLeft, totalTime }) => {
	const radius = 50;
	const stroke = 8;
	const normalizedRadius = radius - stroke * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = totalTime > 0 ? circumference - (timeLeft / totalTime) * circumference : circumference;
	const getTimerColor = () => {
		if (totalTime === 0) return 'stroke-cyan-400';
		const percentage = timeLeft / totalTime;
		if (percentage <= 0.25) return 'stroke-red-500';
		if (percentage <= 0.5) return 'stroke-yellow-500';
		return 'stroke-cyan-400';
	};
	return (
		<div className="relative flex items-center justify-center">
			<svg height={radius * 2} width={radius * 2} className="-rotate-90">
				<circle stroke="#374151" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
				<circle stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} r={normalizedRadius} cx={radius} cy={radius} className={`transition-all duration-500 ease-linear ${getTimerColor()}`} />
			</svg>
			<div className="absolute flex flex-col items-center justify-center">
				<span className="text-3xl font-bold text-white">{timeLeft}</span>
				<span className="text-xs text-slate-400">seconds</span>
			</div>
		</div>
	);
};

export default CircularTimer;


