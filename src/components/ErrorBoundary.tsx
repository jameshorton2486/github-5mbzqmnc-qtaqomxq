import React, { Component, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { handleErrorBoundary } from '../lib/error-handler';
import { Button } from './ui/Button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
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
    handleErrorBoundary(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleBackToHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReload}
                icon={<RefreshCw className="h-5 w-5" />}
              >
                Reload Page
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleBackToHome}
                icon={<Home className="h-5 w-5" />}
              >
                Back to Home
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error?.stack && (
              <div className="mt-8 text-left">
                <details className="text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-300">
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