"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/ui/custom-button";
import { Lock, Mail, AlertCircle, ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRedirectIfAuthenticated } from "@/hooks/useAuth";

type AuthView = 'login' | 'forgot';

import { useToast } from "@/context/ToastContext";

export default function AuthPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { isLoading: authLoading, isAuthenticated, login } = useRedirectIfAuthenticated();
    const [view, setView] = useState<AuthView>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Form States
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [forgotEmail, setForgotEmail] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    // Clear messages when switching views
    useEffect(() => {
        setError(null);
        setSuccess(null);
    }, [view]);

    // Handlers
    const handleLoginChange = (name: string, value: string) => {
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleForgotChange = (value: string) => {
        setForgotEmail(value);
        if (error) setError(null);
    };

    // Submit Logic
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            setError("Please fill in all fields");
            return;
        }
        if (!loginData.email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Authenticate with Supabase
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });

            if (authError) {
                setError(authError.message || "Invalid credentials. Please try again.");
                return;
            }

            if (data.session && data.user) {
                // Store the session token and user info
                const userData = {
                    id: data.user.id,
                    email: data.user.email || loginData.email,
                    name: data.user.user_metadata?.name || 'Admin User',
                    role: 'admin'
                };
                
                login(data.session.access_token, userData);
                
                console.log("Login successful");
                showToast("Login successful!", "success");
                router.push("/admin");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!forgotEmail) {
            setError("Please enter your email address");
            return;
        }
        if (!forgotEmail.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            
            if (resetError) {
                setError(resetError.message || "An error occurred. Please try again.");
                return;
            }
            
            setSuccess("If an account exists, a reset link has been sent.");
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If already authenticated, show redirect message (hook handles actual redirect)
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Already authenticated. Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8 font-tajawal relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-primary-200/50 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] bg-secondary/50 rounded-full blur-[80px] pointer-events-none" />

            <div
                className={cn(
                    "w-full max-w-md space-y-8 bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-xl border border-white/50 relative z-10 transition-all duration-700 ease-out",
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
            >

                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center mb-2 shadow-lg transform transition-transform hover:scale-105 duration-300">
                        <ShoppingBag size={24} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                        {view === 'login' ? 'Welcome to Tuhfa' : 'Reset Password'}
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                        {view === 'login' ? 'Admin Dashboard Access' : 'Enter your email to receive instructions'}
                    </p>
                </div>

                {/* Forms */}
                <div className="mt-8">
                    {view === 'login' ? (
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleLoginSubmit}>
                            <div className="space-y-5">
                                <div className="group">
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="admin@store.com"
                                        value={loginData.email}
                                        onChange={(value) => handleLoginChange('email', value)}
                                        leftIcon={<Mail className="w-5 h-5 text-neutral-400 group-focus-within:text-black transition-colors" />}
                                        error={!!error}
                                        disabled={loading}
                                        className="w-full"
                                    />
                                </div>

                                <div className="group">
                                    <Input
                                        label="Password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={(value) => handleLoginChange('password', value)}
                                        leftIcon={<Lock className="w-5 h-5 text-neutral-400 group-focus-within:text-black transition-colors" />}
                                        error={!!error}
                                        disabled={loading}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-sm text-error-400 bg-error-50 p-3 rounded-lg border border-error-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="pt-2">
                                <CustomButton
                                    text="Sign In"
                                    variant="filled"
                                    loading={loading}
                                    htmlType="submit"
                                    className="w-full justify-center h-12 text-base shadow-lg shadow-neutral-200/50 hover:shadow-neutral-300/50 transition-shadow"
                                />
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setView('forgot')}
                                    className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300" onSubmit={handleForgotSubmit}>
                            {!success ? (
                                <>
                                    <div className="space-y-5">
                                        <div className="group">
                                            <Input
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                placeholder="admin@store.com"
                                                value={forgotEmail}
                                                onChange={handleForgotChange}
                                                leftIcon={<Mail className="w-5 h-5 text-neutral-400 group-focus-within:text-black transition-colors" />}
                                                error={!!error}
                                                disabled={loading}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 text-sm text-error-400 bg-error-50 p-3 rounded-lg border border-error-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <CustomButton
                                            text="Send Reset Link"
                                            variant="filled"
                                            loading={loading}
                                            htmlType="submit"
                                            className="w-full justify-center h-12 text-base shadow-lg shadow-neutral-200/50 hover:shadow-neutral-300/50 transition-shadow"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
                                    <div className="h-16 w-16 bg-success-100 text-success-400 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <p className="text-center text-sm text-neutral-600">
                                        {success}
                                    </p>
                                </div>
                            )}

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors mx-auto"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Back to Sign In</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="absolute bottom-6 text-center text-xs text-neutral-400/60">
                <p>&copy; {new Date().getFullYear()} Tuhfa Store. All rights reserved.</p>
            </div>
        </div>
    );
}
