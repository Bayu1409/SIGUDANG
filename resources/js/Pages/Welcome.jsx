import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth = {}, status, flash }) {
    const [activeTab, setActiveTab] = useState('login');
    const [isMounted, setIsMounted] = useState(false);

    // Aktifkan tab login jika ada status/flash berhasil (setelah daftar)
    useEffect(() => {
        if (status || flash?.message) {
            setActiveTab('login');
        }
    }, [status, flash]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Helper untuk rute yang aman (mencegah crash jika route() belum siap)
    const safeRoute = (name, params) => {
        try {
            return route(name, params);
        } catch (e) {
            return '#';
        }
    };

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const onLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(safeRoute('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post(safeRoute('register'), {
            onSuccess: () => registerForm.reset(),
        });
    };

    const Icons = {
        Logo: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
        )
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-700">
            <Head title="SiGudang - Portal Masuk" />

            {/* SISI KIRI: Brand Identity */}
            <div className="md:w-1/2 bg-indigo-600 relative overflow-hidden flex items-center justify-center p-12">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center md:text-left max-w-md">
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl mb-8 text-white shadow-2xl">
                        <Icons.Logo />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
                        Efisiensi Gudang <br /> dalam Satu Genggaman.
                    </h1>
                    <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                        Kelola stok, pantau mutasi barang, dan optimalkan inventaris Anda dengan sistem yang cerdas dan terintegrasi.
                    </p>
                </div>
            </div>

            {/* SISI KANAN: Unified Auth (Login + Register) */}
            <div className="md:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="mb-10 text-left">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang di SiGudang</h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Silakan masuk untuk mengakses dashboard Anda.</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8">
                        <button 
                            type="button"
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Masuk
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Daftar
                        </button>
                    </div>

                    {/* Success Alert (After Register) */}
                    {(status || flash?.message) && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm shadow-emerald-100/50">
                            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </div>
                            <p className="text-sm font-bold text-emerald-800 leading-tight">
                                {status || flash.message}
                            </p>
                        </div>
                    )}

                    {/* Form Login */}
                    {activeTab === 'login' ? (
                        <form onSubmit={onLoginSubmit} className="space-y-5 text-left">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={loginForm.data.email}
                                    onChange={e => loginForm.setData('email', e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 transition-all outline-none font-medium placeholder:text-slate-400"
                                    placeholder="nama@sigudang.com"
                                />
                                {loginForm.errors.email && <p className="text-[10px] text-red-500 mt-2 font-bold px-1 uppercase tracking-tight">{loginForm.errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-[10px] font-bold text-indigo-600 hover:underline">Lupa Password?</a>
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={loginForm.data.password}
                                    onChange={e => loginForm.setData('password', e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 transition-all outline-none font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center px-1">
                                <input 
                                    type="checkbox" 
                                    id="remember"
                                    checked={loginForm.data.remember}
                                    onChange={e => loginForm.setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-3 text-xs text-slate-500 font-medium select-none cursor-pointer">Simpan sesi login saya</label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loginForm.processing}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-[0.98] mt-4"
                            >
                                {loginForm.processing ? 'SINKRONISASI...' : 'MASUK KE DASHBOARD'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={onRegisterSubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    required
                                    value={registerForm.data.name}
                                    onChange={e => registerForm.setData('name', e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                                    placeholder="Nama Lengkap"
                                />
                                {registerForm.errors.name && <p className="text-[10px] text-red-500 px-1 mt-1 font-bold">{registerForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={registerForm.data.email}
                                    onChange={e => registerForm.setData('email', e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                                    placeholder="email@example.com"
                                />
                                {registerForm.errors.email && <p className="text-[10px] text-red-500 px-1 mt-1 font-bold">{registerForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={registerForm.data.password}
                                    onChange={e => registerForm.setData('password', e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                                    placeholder="Buat Password"
                                />
                                {registerForm.errors.password && <p className="text-[10px] text-red-500 px-1 mt-1 font-bold">{registerForm.errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Konfirmasi Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={registerForm.data.password_confirmation}
                                    onChange={e => registerForm.setData('password_confirmation', e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                                    placeholder="Ulangi Password"
                                />
                                {registerForm.errors.password_confirmation && <p className="text-[10px] text-red-500 px-1 mt-1 font-bold">{registerForm.errors.password_confirmation}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={registerForm.processing}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all mt-4"
                            >
                                {registerForm.processing ? 'MEMPROSES...' : 'DAFTAR AKUN BARU'}
                            </button>
                        </form>
                    )}

                    {auth?.user && (
                        <div className="mt-8 text-center pt-8 border-t border-slate-50">
                            <Link href={safeRoute('dashboard')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2 uppercase tracking-widest">
                                &larr; Sesi Aktif: Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
            `}} />
        </div>
    );
}
