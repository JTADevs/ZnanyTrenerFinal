<?php

namespace App\Repository;

use App\Services\FirebaseService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class User implements UserInterface
{
    protected $auth;
    protected $firestore;

    public function __construct(FirebaseService $firebase)
    {
        $this->auth = $firebase->auth();
        $this->firestore = $firebase->firestore()->database();
    }

    public function updateUser(string $uid, array $data)
    {
        $authData = Arr::only($data, ['email']);
        $firestoreData = Arr::except($data, ['uid', 'email', 'token']);

        try {
            if (!empty($authData)) {
                $this->auth->updateUser($uid, $authData);
            }

            if (!empty($firestoreData)) {
                $this->firestore
                    ->collection('users')
                    ->document($uid)
                    ->set($firestoreData, ['merge' => true]);
            }

            $authRecord = $this->auth->getUser($uid);
            $firestoreRecord = $this->getUserByUid($uid);

            return [
                'uid' => $authRecord->uid,
                'email' => $authRecord->email,
                'displayName' => $authRecord->displayName,
                ...($firestoreRecord ?? [])
            ];

        } catch (\Throwable $e) {
            Log::error('KRYTYCZNY BŁĄD FIREBASE:', ['uid' => $uid, 'error' => $e->getMessage()]);
            return null;
        }
    }

    public function getUserByUid(string $uid)
    {
        try {
            $snapshot = $this->firestore->collection('users')->document($uid)->snapshot();
            return $snapshot->exists() ? $snapshot->data() : null;
        } catch (\Throwable $e) {
            Log::error('Błąd pobierania z Firestore:', ['uid' => $uid, 'error' => $e->getMessage()]);
            return null;
        }
    }
}