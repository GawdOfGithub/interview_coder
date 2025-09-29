import React from 'react';

const CheckIcon = ({ className = "w-6 h-6" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<polyline points="20 6 9 17 4 12"></polyline>
	</svg>
);

const XIcon = ({ className = "w-6 h-6" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<line x1="18" y1="6" x2="6" y2="18"></line>
		<line x1="6" y1="6" x2="18" y2="18"></line>
	</svg>
);

const AnswerCard = ({ questionData }) => {
	const { question, yourAnswer, originalAnswer, isCorrect } = questionData;
	const cardShadowColor = isCorrect ? 'shadow-green-500/10' : 'shadow-red-500/10';

	return (
		<div className={`bg-slate-800/60 p-6 rounded-xl border border-slate-700/80 shadow-lg ${cardShadowColor} transition-all hover:shadow-xl hover:border-slate-600`}>
			<h3 className="font-semibold text-lg text-slate-200 mb-4">{question}</h3>
			<div className="space-y-3">
				<div className="flex justify-between items-start">
					<p className="text-slate-400">Your Answer:</p>
					<p className="text-right text-slate-300 font-medium">{yourAnswer}</p>
				</div>
				<div className="flex justify-between items-start">
					<p className="text-slate-400">Correct Answer:</p>
					<div className="flex items-center gap-2 text-right">
						{isCorrect ? (
							<span className="text-green-400 text-sm font-semibold flex items-center gap-1">
								<CheckIcon className="w-4 h-4" /> Correct
							</span>
						) : (
							<span className="text-red-400 text-sm font-semibold flex items-center gap-1">
								<XIcon className="w-4 h-4" /> Incorrect
							</span>
						)}
						<p className="text-slate-300 font-medium">{originalAnswer}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnswerCard;


