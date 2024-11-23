import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-primary text-onPrimary">
          <div className="p-6 border border-accent rounded-lg bg-surface shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-accent mb-4 flex items-center">
              <span className="mr-2">⚠️</span> Oops! Something went wrong
            </h1>
            <p className="text-sm text-secondary mb-6">
              We encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <div className="flex space-x-4">
              <button
                className="flex-1 py-2 px-4 text-sm font-semibold text-onAccent bg-accent rounded-lg hover:bg-accentHover transition duration-300"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
