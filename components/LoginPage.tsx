import React, { useState } from 'react';
import { signInWithGoogle } from '../lib/supabase';

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.25 2 7 4.25 7 7c0 .91.24 1.76.66 2.52-.75.6-1.35 1.4-1.63 2.33-.24.78-.33 1.62-.27 2.47.1.92.53 1.79 1.15 2.5.49.56 1.09 1.02 1.77 1.36.1.75.31 1.47.63 2.14.28.6.64 1.15 1.07 1.63.21.24.5.37.8.37s.59-.13.8-.37c.43-.48.79-1.03 1.07-1.63.32-.67.53-1.39.63-2.14.68-.34 1.28-.79 1.77-1.36.62-.71 1.05-1.58 1.15-2.5.06-.85-.03-1.69-.27-2.47-.28-.93-.88-1.73-1.63-2.33.42-.76.66-1.61.66-2.52C17 4.25 14.75 2 12 2zm-1 14.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm2 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
    </svg>
);

const GoogleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BrainIcon className="w-16 h-16 text-cyan-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Welcome to AI Business Consultant
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your personalized business planning assistant
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : (
                <GoogleIcon className="w-5 h-5 mr-3" />
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What you'll get:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Personalized business plan generation</li>
                <li>• Financial projections and analysis</li>
                <li>• SWOT analysis and market insights</li>
                <li>• Save and manage multiple business plans</li>
                <li>• Interactive planning workspace</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;