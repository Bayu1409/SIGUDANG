import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, Package, User, Shield } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'admin',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            <Head title="Daftar – Sigudang" />

            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">SIGUDANG</h1>
                    <p className="text-sm text-slate-500 mt-1">Buat akun baru</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <form onSubmit={submit} className="space-y-4">

                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama lengkap Anda"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@contoh.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Hak Akses (Role) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Hak Akses (Role)
                            </label>
                            <div className="relative">
                                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>
                            <InputError message={errors.role} className="mt-1" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min. 8 karakter"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Mendaftarkan...
                                </>
                            ) : 'Buat Akun'}
                        </button>
                    </form>
                </div>

                {/* Link ke Login */}
                <p className="text-center text-sm text-slate-500 mt-5">
                    Sudah punya akun?{' '}
                    <Link href={route('login')}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                        Masuk di sini
                    </Link>
                </p>

                <p className="text-center text-xs text-slate-400 mt-3">
                    © 2026 Sigudang – Gudang Pramuka
                </p>
            </div>
        </div>
    );
}
