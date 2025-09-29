import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveTab } from '../../store/slices/interviewSlice';
import { selectCandidateById } from '../../store/slices/candidatesSlice';

const HeaderTabs = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const activeTab = useSelector((state) => state.interview.activeTab);
	const currentCandidateId = useSelector((state) => state.interview.currentCandidateId);
	const currentCandidate = useSelector((state) => selectCandidateById(state, currentCandidateId));
	const intervieweeDisabled = Boolean(currentCandidate && currentCandidate.quizCompleted);

	return (
		<div className="flex items-center space-x-2 pb-4 w-full">
			<button
				onClick={() => {
					if (intervieweeDisabled) {
						const targetId = (currentCandidate && (currentCandidate.id || currentCandidateId)) || currentCandidateId;
						if (targetId) navigate(`/profile/${targetId}`);
						return;
					}
					dispatch(setActiveTab('interviewee'));
				}}
				disabled={intervieweeDisabled}
				className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
					activeTab === 'interviewee'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
				} ${intervieweeDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
			>
				Interviewee
			</button>
			<button
				onClick={() => dispatch(setActiveTab('interviewer'))}
				className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
					activeTab === 'interviewer'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
				}`}
			>
				Interviewer
			</button>
		</div>
	);
};

export default HeaderTabs;


