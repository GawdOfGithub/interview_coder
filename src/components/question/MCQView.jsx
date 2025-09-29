import React from 'react';

const MCQView = ({ currentQuestionIndex, totalQuestions, question, options, selectedOption, onSelectOption, onSubmit }) => {
	return (
		<div className="flex flex-col justify-center">
			<div className="flex justify-between items-baseline">
				<p className="text-lg font-semibold text-blue-400 mb-2">Question {currentQuestionIndex + 1}/{totalQuestions}</p>
				{question?.difficulty && (
					<span
						className={`px-3 py-1 text-sm font-bold rounded-full ${
							question.difficulty === 'Easy'
								? 'bg-green-500/20 text-green-400'
								: question.difficulty === 'Medium'
								? 'bg-yellow-500/20 text-yellow-400'
								: 'bg-red-500/20 text-red-400'
						}`}
					>
						{question.difficulty}
					</span>
				)}
			</div>
			<h2 className="text-2xl md:text-3xl font-bold text-slate-100 leading-tight my-8 min-h-[100px]">
				{question?.question}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{options?.map((option, index) => (
					<button
						key={index}
						onClick={() => onSelectOption(option)}
						className={`p-4 rounded-lg text-left transition-all duration-300 border-2 ${
							selectedOption === option
								? 'bg-blue-600 border-blue-500 text-white shadow-lg'
								: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
						}`}
					>
						<span className={`font-mono mr-3 font-bold ${selectedOption === option ? 'text-white' : 'text-blue-400'}`}>
							{String.fromCharCode(65 + index)}
						</span>
						<span className="font-semibold">{option}</span>
					</button>
				))}
			</div>
			<button
				onClick={onSubmit}
				disabled={!selectedOption}
				className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
			>
				Submit Answer
			</button>
		</div>
	);
};

export default MCQView;


