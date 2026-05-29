<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ============================================
        // AKUN SUPER ADMIN - Akses penuh ke semua fitur
        // ============================================
        User::create([
            'name'     => 'Super Admin',
            'email'    => 'superadmin@sigudang.com',
            'password' => Hash::make('superadmin123'),
            'role'     => 'superadmin',
        ]);

        // ============================================
        // AKUN ADMIN - Akses standar
        // ============================================
        User::create([
            'name'     => 'Admin Gudang',
            'email'    => 'admin@sigudang.com',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);
    }
}

