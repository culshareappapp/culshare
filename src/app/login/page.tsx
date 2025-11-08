'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- وارد کردن هوک برای جابجایی بین صفحات
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabaseClient'; // <-- وارد کردن کلاینت Supabase که قبلا ساختیم

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // <-- استفاده از هوک روتر

  // تابع ثبت نام
  const handleSignUp = async () => {
    if (password.length < 6) {
      alert('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    
    // ارسال درخواست ثبت نام به Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert('خطا در ثبت نام: ' + error.message);
    } else if (data.user) {
      alert('ثبت نام با موفقیت انجام شد! حالا می‌توانید وارد شوید.');
      // میتوانید کاربر را مستقیم به صفحه اصلی هدایت کنید یا به او اجازه دهید خودش وارد شود
    }
  };

  // تابع ورود
  const handleSignIn = async () => {
    // ارسال درخواست ورود به Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert('خطا در ورود: ' + error.message);
    } else if (data.user) {
      alert('خوش آمدید!');
      router.push('/'); // <-- هدایت کاربر به صفحه اصلی (/) بعد از ورود موفق
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <Card className="w-full max-w-sm bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to CulShare</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 placeholder:text-gray-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pt-2">
                <Button onClick={handleSignIn} className="w-full bg-pink-600 hover:bg-pink-700">Sign In</Button>
                <Button onClick={handleSignUp} variant="outline" className="w-full border-pink-600 hover:bg-pink-600 hover:text-white">Sign Up</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}