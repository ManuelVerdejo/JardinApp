import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border-2 border-emerald-200 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              🌱
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">¡Ups! Algo se detuvo en el jardín</h2>
            <p className="text-xs text-gray-600 mb-4">
              Ocurrió un pequeño problema al cargar la pantalla. Puedes pulsar el botón de abajo para recargar la aplicación.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-left p-3 bg-gray-50 border rounded-xl overflow-x-auto text-red-500 mb-4 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
              >
                🔄 Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
