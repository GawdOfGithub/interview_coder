import React from 'react';
import { Bot, Paperclip } from 'lucide-react';
import Loading from '../../components/common/Loading';
import ErrorNotice from '../../components/common/ErrorNotice';

const UploadView = ({ onFileSelect, isLoading, error }) => {
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			onFileSelect(file);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-full text-center text-gray-300 p-6 md:p-10">
			<div className="bg-blue-500/10 p-6 rounded-full mb-8 border border-blue-500/20">
				<Bot className="w-20 h-20 text-blue-400" strokeWidth={1.5} />
			</div>
			<h2 className="text-3xl font-bold text-white mb-4">Upload resume to get started</h2>
			<p className="text-gray-400 max-w-md mb-8">
				Our AI will analyze your resume to tailor a personalized interview experience for you.
			</p>
			{isLoading && <Loading message="Processing resume, please wait..." />}
			{error && <ErrorNotice title="Upload failed" message={error} />}
			<div>
				<label htmlFor="resume-upload" className={`w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
					<Paperclip size={20} className="mr-3"/>
					<span>{isLoading ? 'Uploading...' : 'Choose Your Resume'}</span>
				</label>
				<input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={isLoading} />
				<p className="text-xs text-gray-500 mt-3">Supports: PDF, DOC, DOCX</p>
			</div>
		</div>
	);
};

export default UploadView;


