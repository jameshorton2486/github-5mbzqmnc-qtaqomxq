import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to provided handler or console
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Example of remote error logging
    this.logErrorToService(error, errorInfo).catch(console.error);
  }

  private async logErrorToService(error: Error, errorInfo: ErrorInfo) {
    try {
      // Example implementation - replace with your error logging service
      const errorData = {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        metadata: {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      };

      // Uncomment and configure for your error logging service
      // await fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleBackToHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-300 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <RotateCcw className="h-5 w-5" />
                Reload Page
              </button>
              
              <button
                onClick={this.handleBackToHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <div className="mt-8 text-left">
                <details className="text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-300 transition-colors duration-200">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-900 rounded-lg overflow-x-auto text-sm">
                    {this.state.error.stack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}