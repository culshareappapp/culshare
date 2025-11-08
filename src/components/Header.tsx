'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js'; // وارد کردن نوع User
import { Button } from './ui/button';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // این تابع وضعیت فعلی کاربر را از Supabase میگیرد
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    getSession();

    // این بخش به تغییرات وضعیت ورود/خروج گوش میدهد
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // در انتها listener را پاک میکنیم تا از نشت حافظه جلوگیری شود
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // کاربر را به صفحه اصلی هدایت میکنیم
  };

  return (
    <header className="absolute top-0 left-0 w-full p-4 bg-transparent text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        CulShare
      </Link>
      <div>
        {user ? (
          // اگر کاربر وارد شده باشد
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user.email}</span>
            <Button onClick={handleSignOut} variant="outline" className="border-pink-600 text-white hover:bg-pink-600">
              Sign Out
            </Button>
          </div>
        ) : (
          // اگر کاربر وارد نشده باشد
          <Link href="/login">
            <Button className="bg-pink-600 hover:bg-pink-700">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}