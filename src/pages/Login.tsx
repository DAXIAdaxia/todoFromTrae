import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginPage() {
  const { user, loading, signInWithGitHub } = useAuth();
  const location = useLocation();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e3a5f]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleGitHubLogin = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGitHub();
    } catch (err) {
      setError((err as Error).message);
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Todo 待办</h1>
            <p className="mt-2 text-gray-500">高效管理你的日常任务</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGitHubLogin}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
            >
              {signingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              使用 GitHub 登录
            </button>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                多维度任务分类与标签
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                云端同步，随时随地访问
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                GitHub 账号安全登录
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
