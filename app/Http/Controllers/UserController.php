<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use App\Services\LogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get()->map(function ($user) {
            // Superadmin tidak boleh dihapus
            if ($user->role === 'superadmin') {
                $user->can_delete = false;
                $user->delete_reason = 'Akun Superadmin tidak dapat dihapus.';
                return $user;
            }
            // Hanya cek riwayat TRANSAKSI (bukan login)
            $hasTransaksi = ActivityLog::where('user_id', $user->id)
                ->whereIn('model', ['BarangMasuk', 'BarangKeluar'])
                ->exists();
            $user->can_delete = !$hasTransaksi;
            $user->delete_reason = $hasTransaksi ? 'Memiliki riwayat transaksi barang.' : null;
            return $user;
        });

        return Inertia::render('User/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('User/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'superadmin'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => now(),
        ]);

        LogService::log("Membuat user baru: {$user->name} ({$user->role})", 'User', $user->id);

        return redirect()->route('users.index')->with('message', "Akun petugas \"{$user->name}\" berhasil ditambahkan.");
    }

    public function edit(User $user)
    {
        return Inertia::render('User/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'superadmin'])],
        ]);

        if ($request->filled('password')) {
            $request->validate(['password' => 'confirmed|min:8']);
            $user->password = Hash::make($request->password);
        }

        $oldRole = $user->role;
        $oldName = $user->name;
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);

        LogService::log("Memperbarui user: {$user->name}. Role: {$oldRole} -> {$user->role}", 'User', $user->id);

        $roleChanged = $oldRole !== $validated['role'];
        $msg = $roleChanged
            ? "Data petugas \"{$user->name}\" berhasil diperbarui. Role diubah dari {$oldRole} menjadi {$user->role}."
            : "Data petugas \"{$user->name}\" berhasil diperbarui.";

        return redirect()->route('users.index')->with('message', $msg);
    }

    public function destroy(User $user)
    {
        $name = $user->name;
        $id = $user->id;

        if ($id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // Superadmin tidak boleh dihapus
        if ($user->role === 'superadmin') {
            return back()->with('error', "Akun Superadmin \"{$name}\" tidak dapat dihapus.");
        }

        // Cek apakah user memiliki riwayat TRANSAKSI (BarangMasuk/BarangKeluar)
        $hasTransaksi = ActivityLog::where('user_id', $id)
            ->whereIn('model', ['BarangMasuk', 'BarangKeluar'])
            ->exists();

        if ($hasTransaksi) {
            return back()->with('error', "Akun petugas \"{$name}\" tidak dapat dihapus karena memiliki riwayat transaksi barang di sistem.");
        }

        $user->delete();
        LogService::log("Menghapus user: {$name}", 'User', $id);

        return redirect()->route('users.index')->with('message', "Akun petugas \"{$name}\" berhasil dihapus dari sistem.");
    }
}

