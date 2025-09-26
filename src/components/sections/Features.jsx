import React from 'react';
import FeatureCard from '../features/FeatureCard';
import IntervieweeMockUI from '../features/IntervieweeMockUI';
import InterviewerMockUI from '../features/InterviewerMockUI';

const Features = () => {
    const intervieweeFeatures = ["Practice with AI", "Get Instant Feedback", "Track Your Progress"];
    const interviewerFeatures = ["Manage Candidates", "AI Summaries", "Data-Driven Hiring"];

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-10">
                    <FeatureCard title="For Interviewees" features={intervieweeFeatures} mockUI={<IntervieweeMockUI />} />
                    <FeatureCard title="For Interviewers" features={interviewerFeatures} mockUI={<InterviewerMockUI />} />
                </div>
            </div>
        </section>
    );
};

export default Features;
