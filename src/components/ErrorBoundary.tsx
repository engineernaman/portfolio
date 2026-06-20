import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#010208] text-white flex items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something broke</h1>
            <p className="text-gray-400 mb-6 font-mono text-sm">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-500 text-black rounded-full font-bold"
            >
              Reload site
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
