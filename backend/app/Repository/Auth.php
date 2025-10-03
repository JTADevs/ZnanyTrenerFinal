<?php

namespace App\Repository;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\FirebaseService;

class Auth implements AuthInterface
{
    protected FirebaseService $firebase;
    protected $firebaseApiKey;

    public function __construct(FirebaseService $firebase, $firebaseApiKey = null)
    {
        $this->firebase = $firebase;
        $this->firebaseApiKey = env('FIREBASE_API_KEY');
    }

    public function login(array $data)
    {
        $response = Http::post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={$this->firebaseApiKey}", [
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

    public function register(array $data)
    {
        $checkUser = Http::post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={$this->firebaseApiKey}",[
            'email' => $data['email'],
            'password' => $data['password'],
            'returnSecureToken' => true,
        ]);

        if($checkUser->successful()){
            return ['error' => 'Użytkownik z tym emailem już istnieje'];
        }

        $createUser = Http::post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={$this->firebaseApiKey}", [
            'email' => $data['email'],
            'password' => $data['password'],
            'returnSecureToken' => true,
        ]);

        if(!$createUser->successful()){
            return ['error' => 'Użytkownik z tym emailem już istnieje'];
        }

        $firestoreData = array_filter([
            '_token' => $createUser['idToken'],
            'created_at' => now(),
            'updated_at' => now(),
            'role' => $data['role'] ?? 'client',
            'email' => $data['email'] ?? null,
            'fullname' => $data['fullname'] ?? null,
            
        ], fn($value) => $value !== null || is_bool($value));

        $this->firebase->firestore()
            ->database()
            ->collection('users')
            ->document($createUser['localId'])
            ->set($firestoreData);

        return [
            'token' => $createUser['idToken'],
            'user' => [
                'uid'         => $createUser['localId'],
                'email'       => $createUser['email'],
                'displayName' => $data['fullname'] ?? null,
                'role'        => $data['role'] ?? 'client',
            ]
        ];
    }
}