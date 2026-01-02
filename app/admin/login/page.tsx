"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // If already logged in, redirect to dashboard
        const token = localStorage.getItem('admin_token');
        if (token) {
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                router.push('/admin');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Connection refused. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Login</h1>
                    <p className="text-neutral-500">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 ml-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <CustomButton
                        htmlType="submit"
                        text={isLoading ? "Signing in..." : "Sign In"}
                        className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-neutral-200"
                        disabled={isLoading}
                    />
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                    <p className="text-neutral-400 text-sm">
                        Protected area. Unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
}
