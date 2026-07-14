<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::create([
    'name' => 'Admin Test',
    'email' => 'admintest@sigudang.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);

echo "User dibuat: " . $user->name . " | ID: " . $user->id . " | Role: " . $user->role . PHP_EOL;
echo "Login dengan: admintest@sigudang.com / password123" . PHP_EOL;
