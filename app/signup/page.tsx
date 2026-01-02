"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/ui/custom-button";
import { Lock, Mail, AlertCircle, ShoppingBag, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
    const router = useRouter();
    const { signup, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [requiresConfirmation, setRequiresConfirmation] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Please enter your name");
            return false;
        }
        if (!formData.email || !formData.email.includes("@")) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const result = await signup(formData.email, formData.password, formData.name);
            
            if (!result.success) {
                setError(result.error || "Signup failed. Please try again.");
                setLoading(false);
                return;
            }

            if (result.requiresConfirmation) {
                setRequiresConfirmation(true);
                setSuccess(true);
            } else {
                setSuccess(true);
                // Redirect clients to home page after successful signup
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                        Create Account
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                        Join Tuhfa and start shopping
                    </p>
                </div>

                {/* Form */}
                <div className="mt-8">
                    {!success ? (
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div className="group">
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(value) => handleChange('name', value)}
                                        leftIcon={<User className="w-5 h-5 text-neutral-400 group-focus-within:text-black transition-colors" />}
                                        error={!!error}
                                        disabled={loading}
                                        className="w-full"
                                    />
                                </div>

                                <div className="group">
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(value) => handleChange('email', value)}
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
                                        value={formData.password}
                                        onChange={(value) => handleChange('password', value)}
                                        leftIcon={<Lock className="w-5 h-5 text-neutral-400 group-focus-within:text-black transition-colors" />}
                                        error={!!error}
                                        disabled={loading}
                                        className="w-full"
                                    />
                                </div>

                                <div className="group">
                                    <Input
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(value) => handleChange('confirmPassword', value)}
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
                                    text="Create Account"
                                    variant="filled"
                                    loading={loading}
                                    htmlType="submit"
                                    className="w-full justify-center h-12 text-base shadow-lg shadow-neutral-200/50 hover:shadow-neutral-300/50 transition-shadow"
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-neutral-500">
                                    Already have an account?{' '}
                                    <Link 
                                        href="/auth" 
                                        className="text-black font-semibold hover:underline transition-all"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-success-100 text-success-400 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900">
                                {requiresConfirmation ? 'Check Your Email' : 'Account Created!'}
                            </h3>
                            <p className="text-center text-sm text-neutral-600 max-w-sm">
                                {requiresConfirmation 
                                    ? 'We sent a confirmation link to your email. Please verify your account before signing in.'
                                    : 'Your account has been created successfully. Redirecting...'}
                            </p>
                            {requiresConfirmation && (
                                <Link 
                                    href="/auth"
                                    className="mt-4"
                                >
                                    <CustomButton
                                        text="Go to Sign In"
                                        variant="filled"
                                        className="px-8"
                                    />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-6 text-center text-xs text-neutral-400/60">
                <p>&copy; {new Date().getFullYear()} Tuhfa Store. All rights reserved.</p>
            </div>
        </div>
    );
}
