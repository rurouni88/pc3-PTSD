import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

const CRASH_MESSAGES = [
  'Your phone crashed. Fitting.',
  'The phone has achieved sentience and refuses to continue.',
  'Grandma pressed the red button. Again.',
  'The RAM Booster has won.',
  'A wild bug appeared and your phone fainted.',
];

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Pick a random crash message (deterministic per crash via message hash)
    const hash = this.state.message.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const crashMsg = CRASH_MESSAGES[hash % CRASH_MESSAGES.length];

    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6 bg-primary">
        <span className="text-5xl">💀</span>
        <h2 className="text-lg font-bold text-primary text-center">Tech Support Failed</h2>
        <p className="text-sm text-secondary text-center">{crashMsg}</p>
        <p className="text-[0.65rem] text-muted text-center max-w-[200px]">
          {this.state.message}
        </p>
        <button
          onClick={this.handleReload}
          className="mt-2 px-6 py-3 bg-accent-green text-primary font-bold rounded-xl active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }
}
