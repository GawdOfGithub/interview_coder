import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../store/slices/interviewSlice';

const HeaderTabs = () => {
	const dispatch = useDispatch();
	const activeTab = useSelector((state) => state.interview.activeTab);

	return (
		<div className="flex items-center space-x-2 pb-4 w-full">
			<button
				onClick={() => dispatch(setActiveTab('interviewee'))}
				className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
					activeTab === 'interviewee'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
				}`}
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


