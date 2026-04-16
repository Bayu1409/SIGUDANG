<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KategoriController;

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('kategori', KategoriController::class);

});