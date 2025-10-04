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
                'premium'       => $userData['premium'] ?? null
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
            'premium' => $data['premium'] ?? null
            
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
                'premium'       => $data['premium'] ?? null
            ]
        ];
    }

    public function loginWithGoogle(array $data)
    {
        try {
            if (isset($data['code'])) {
                $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                    'code' => $data['code'],
                    'client_id' => env('GOOGLE_CLIENT_ID'),
                    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                    'redirect_uri' => 'postmessage',
                    'grant_type' => 'authorization_code',
                ]);
                
                if (!$response->successful()) {
                    return ['error' => 'Nie udało się zweryfikować konta Google (code exchange).'];
                }
                $tokenData = $response->json();
                $idTokenFromGoogle = $tokenData['id_token'];
            } elseif (isset($data['id_token'])) {
                $idTokenFromGoogle = $data['id_token'];
            } else {
                return ['error' => 'Brak kodu autoryzacyjnego lub tokena.'];
            }

            $auth = $this->firebase->auth();
            $signInResult = $auth->signInWithIdpIdToken('google.com', $idTokenFromGoogle);
            $firebaseUser = $signInResult->data();
            $localId = $firebaseUser['localId'];
            $idToken = $firebaseUser['idToken'];

            $userDoc = $this->firebase->firestore()
                ->database()
                ->collection('users')
                ->document($localId)
                ->snapshot();

            if ($userDoc->exists()) {
                $userData = $userDoc->data();
            } else {
                if (!isset($data['role']) || $data['role'] === null) {
                    return [
                        'new_user' => true,
                        'id_token' => $idTokenFromGoogle
                    ];
                }

                $googleUserInfo = $auth->getUser($localId);

                $firestoreData = [
                    'created_at' => now()->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                    'role'       => $data['role'],
                    'email'      => $googleUserInfo->email,
                    'fullname'   => $googleUserInfo->displayName ?? null,
                    'premium'    => ($data['role'] === 'trainer' && isset($data['premium'])) ? $data['premium'] : null,
                ];

                try {
                    $this->firebase->firestore()->database()->collection('users')->document($localId)->set($firestoreData);
                } catch (\Exception $e) {
                    $errorMessage = 'FIRESTORE WRITE FAILED: ' . $e->getMessage();
                    return ['error' => $errorMessage];
                }
                $userData = $firestoreData;
            }

            return [
                'token' => $idToken,
                'user'  => [
                    'uid'         => $localId,
                    'email'       => $userData['email'],
                    'displayName' => $userData['fullname'] ?? ($userData['name'] ?? ''),
                    'role'        => $userData['role'] ?? null,
                    'premium'     => $userData['premium'] ?? null
                ]
            ];
        } catch (\Exception $e) {
            $criticalError = 'CRITICAL GOOGLE LOGIN ERROR: ' . $e->getMessage();
            return ['error' => $criticalError];
        }
    }
}