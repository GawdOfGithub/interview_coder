import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { fetchAllCandidates, fetchCandidateScores } from '../../store/slices/candidatesSlice';

const DashboardView = () => {
	const candidates = useSelector((state) => state.candidates.list);
	const candidatesStatus = useSelector((state) => state.candidates.status);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isRendered, setIsRendered] = useState(false);

	useEffect(() => {
		if (candidatesStatus === 'idle') {
			dispatch(fetchAllCandidates());
		}
	}, [dispatch, candidatesStatus]);

	useEffect(() => {
		candidates.forEach(candidate => {
			if (candidate.id && candidate.score == null) {
				dispatch(fetchCandidateScores(candidate.id));
			}
		});
	}, [candidates, dispatch]);

	useEffect(() => {
		const timer = setTimeout(() => setIsRendered(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const getScoreBadge = (score) => {
		if (score === null || score === undefined) {
			return <span className="text-gray-400">Pending</span>;
		}
		let colorClasses = '';
		if (score >= 80) {
			colorClasses = 'bg-green-500/20 text-green-400';
		} else if (score >= 50) {
			colorClasses = 'bg-yellow-500/20 text-yellow-400';
		} else {
			colorClasses = 'bg-red-500/20 text-red-400';
		}
		return (
			<span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClasses}`}>
				{score}%
			</span>
		);
	};

	return (
		<div className="text-white p-6 md:p-10">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<h2 className="text-2xl font-bold">Candidates</h2>
				<div className="flex items-center gap-2 flex-wrap">
					<div className="relative">
						<input 
							type="text" 
							placeholder="Search..."
							className="bg-[#1a202c]/80 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
						/>
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
					</div>
				</div>
			</div>
			<div className="bg-[#1a202c]/50 rounded-lg overflow-hidden border border-gray-700/50 ">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="bg-gray-700/30">
							<tr>
								<th className="p-4 font-semibold tracking-wider">Name</th>
								<th className="p-4 font-semibold tracking-wider text-center">Score</th>
								<th className="p-4 font-semibold tracking-wider text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{candidates.map((candidate, index) => (
								<tr 
									key={candidate.id || candidate.candidateId} 
									className={`border-b border-gray-700/50 transition-all duration-500 ease-out hover:bg-gray-700/20 hover:shadow-lg hover:-translate-y-1 ${isRendered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
									style={{ transitionDelay: `${index * 50}ms` }}
								>
									<td className="p-4 font-medium flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
											<User size={16} />
										</div>
										{candidate.name}
									</td>
									<td className="p-4 text-center">
										{getScoreBadge(candidate.score)}
									</td>
									<td className="p-4 text-center">
										<button 
											onClick={() => navigate(`/profile/${candidate.id || candidate.candidateId}`)}
											className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors"
										>
											View More
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default DashboardView;


