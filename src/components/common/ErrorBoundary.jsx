import React from 'react';
import ErrorNotice from './ErrorNotice';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
		this.handleRetry = this.handleRetry.bind(this);
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Optionally log to an error reporting service
		// console.error('ErrorBoundary caught:', error, errorInfo);
	}

	handleRetry() {
		this.setState({ hasError: false, error: null });
		if (this.props.onRetry) {
			this.props.onRetry();
		} else {
			// Default retry: reload current route
			window.location.reload();
		}
	}

	render() {
		if (this.state.hasError) {
			const title = this.props.title || 'ERROR';
			const message = this.state.error?.message || this.props.message || 'Oops! Something went wrong.';
			return <ErrorNotice fullScreen title={title} message={message} onRetry={this.handleRetry} />;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;


