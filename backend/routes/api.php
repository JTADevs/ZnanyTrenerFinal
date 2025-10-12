<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login/google', [AuthController::class, 'loginWithGoogle']);
Route::post('/auth/callback/apple', [AuthController::class, 'loginWithApple']);
Route::post('/user/update', [UserController::class, 'edit']);