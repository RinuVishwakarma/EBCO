import React, { Component, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallbackComponent: JSX.Element
}
interface State {
	hasError: boolean;
	errorIs?: Error
}
class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State | null {
		return { hasError: true, errorIs: error };
	}

	render() {
		if (this.state.hasError) {
			return <>{this.props.fallbackComponent}</>;
		}

		return this.props.children;
	}
}
export default ErrorBoundary;
