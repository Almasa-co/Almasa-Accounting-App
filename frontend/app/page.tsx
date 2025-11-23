'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import toast from 'react-hot-toast';

function LoginForm() {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(loginData.email, loginData.password);
            toast.success(t('auth.welcomeBack'));
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(registerData);
            toast.success(t('auth.accountCreated'));
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
                        Almasa
                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${isLogin
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            {t('auth.signIn')}
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${!isLogin
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            {t('auth.createAccount')}
                        </button>
                    </div>

                    {isLogin ? (
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="label">
                                    {t('auth.email')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="input"
                                    placeholder={t('auth.emailPlaceholder')}
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="label">
                                    {t('auth.password')}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="input"
                                    placeholder={t('auth.passwordPlaceholder')}
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('auth.signingIn') : t('auth.signIn')}
                                </button>
                            </div>

                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="label">
                                        {t('auth.firstName')}
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="John"
                                        value={registerData.firstName}
                                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="label">
                                        {t('auth.lastName')}
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="Doe"
                                        value={registerData.lastName}
                                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="reg-email" className="label">
                                    {t('auth.email')}
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    required
                                    className="input"
                                    placeholder="you@example.com"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="reg-password" className="label">
                                    {t('auth.password')}
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    required
                                    className="input"
                                    placeholder="••••••••"
                                    minLength={6}
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>


            </div>
        </div>
    );
}

export default function HomePage() {
    return <LoginForm />;
}
