import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-aurora-gradient text-light-primary px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-dark-border text-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle size={32} className="text-red-400" />
              </motion.div>
              
              <h2 className="text-xl font-bold mb-3">エラーが発生しました</h2>
              
              <p className="text-sm text-light-primary/60 mb-6">
                申し訳ありません。予期しないエラーが発生しました。
                ページを再読み込みしてもう一度お試しください。
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleReset}
                className="bg-light-primary text-dark-base rounded-xl px-6 py-3 font-semibold text-sm flex items-center gap-2 shadow-glass mx-auto"
              >
                <RefreshCw size={18} />
                ページを再読み込み
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}