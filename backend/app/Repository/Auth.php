<?php

namespace App\Repository;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\FirebaseService;

class Auth implements AuthInterface
{
    protected FirebaseService $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

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

        $loginData = $response->json();

        $userDoc = $this->firebase->firestore()
            ->database()
            ->collection('users')
            ->document($loginData['localId'])
            ->snapshot();

        $userData = $userDoc->exists() ? $userDoc->data() : [];

        return [
            'token' => $loginData['idToken'],
            'user'  => [
                'uid'         => $loginData['localId'],
                'email'       => $loginData['email'],
                'displayName' => $loginData['displayName'] ?? ($userData['name'] ?? ''),
                'role'        => $userData['role'] ?? null,
                'companyName' => $userData['company_name'] ?? null,
            ]
        ];
    }
}