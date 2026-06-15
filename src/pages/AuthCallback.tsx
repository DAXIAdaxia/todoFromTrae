import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (session) {
        navigate('/', { replace: true });
      } else {
        setError('登录失败，请重试');
      }
    });
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg"
        >
          返回登录
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
      <p className="mt-3 text-gray-500">正在完成登录...</p>
    </div>
  );
}
