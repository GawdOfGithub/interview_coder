import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, SendHorizontal, User } from 'lucide-react';
import { updateCandidateChatHistory, selectCandidateById } from '../../store/slices/candidatesSlice';
import { setInterviewStarted } from '../../store/slices/interviewSlice';

const ChatView = ({ extractedName }) => {
	const [newMessage, setNewMessage] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentCandidateId = useSelector((state) => state.interview.currentCandidateId);
	const currentCandidate = useSelector((state) => selectCandidateById(state, currentCandidateId));
	const chatHistory = currentCandidate?.chatHistory || [];
	const chatEndRef = React.useRef(null);

	useEffect(() => {
		if (chatHistory.length === 0 && extractedName && currentCandidateId) {
			dispatch(updateCandidateChatHistory({
				candidateId: currentCandidateId,
				message: { sender: 'ai', text: `Hi ${extractedName}, all your details have been extracted. Please type "Start" to begin your interview.` }
			}));
		}
	}, [extractedName, currentCandidateId, dispatch, chatHistory.length]);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatHistory]);

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (newMessage.trim() === '') return;

		const userMessage = { sender: 'user', text: newMessage };
		dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: userMessage }));

		if (newMessage.trim().toLowerCase() === 'start') {
			if (currentCandidate && currentCandidate.quizCompleted) {
				navigate(`/profile/${currentCandidateId}`);
			} else {
				dispatch(setInterviewStarted(true));
				navigate('/question');
			}
		} else {
			const aiPromptMessage = { sender: 'ai', text: "Please type 'Start' to begin the interview." };
			dispatch(updateCandidateChatHistory({ candidateId: currentCandidateId, message: aiPromptMessage }));
		}

		setNewMessage('');
	};

	return (
		<div className="flex flex-col h-[70vh] bg-[#1a202c]/50">
			<div className="flex-1 overflow-y-auto p-6 space-y-6">
				{chatHistory.map((message, index) => (
					<div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
						{message.sender === 'ai' && (
							<div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
								<Bot size={18} />
							</div>
						)}
						<div className={`max-w-lg p-3 rounded-lg shadow-md ${
							message.sender === 'ai' 
							? 'bg-gray-700 text-gray-200 rounded-bl-none' 
							: 'bg-blue-600 text-white rounded-br-none'
						}`}> 
							<p className="text-sm leading-relaxed">{message.text}</p>
						</div>
						{message.sender === 'user' && (
							<div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
								<User size={16} />
							</div>
						)}
					</div>
				))}
				<div ref={chatEndRef} />
			</div>
			<div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
				<form onSubmit={handleSendMessage} className="relative">
					<input 
						type="text" 
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type 'Start' to begin..."
						className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
						<SendHorizontal className="h-6 w-6" />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatView;


