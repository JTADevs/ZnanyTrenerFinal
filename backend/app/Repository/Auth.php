<?php

namespace App\Repository;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Auth implements AuthInterface
{
    public function login(array $data)
    {
        $firebaseApiKey = env('FIREBASE_API_KEY');

        $response = Http::post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={$firebaseApiKey}", [
            'email' => $data['email'],
            'password' => $data['password'],
            'returnSecureToken' => true,
        ]);

        if (!$response->successful()) {
            return ['error' => 'Nieprawidłowy email lub hasło'];
        }

    }
}