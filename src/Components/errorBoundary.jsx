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
                <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                    <div className="p-6 border border-red-500 rounded-lg bg-gray-800 shadow-lg max-w-md w-full">
                        <h1 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
                            <span className="mr-2">⚠️</span> Oops! Something went wrong
                        </h1>
                        <p className="text-sm text-gray-300 mb-6">
                            More info about this error goes here. Try refreshing the page or check back later.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                className="flex-1 py-2 px-4 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
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
