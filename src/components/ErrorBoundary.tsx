import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Application Error</h1>
                <p className="text-xs text-rose-400">An unexpected error occurred</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl text-xs text-rose-300/90 font-mono mb-6 overflow-auto max-h-32 border border-slate-800">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-md"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
