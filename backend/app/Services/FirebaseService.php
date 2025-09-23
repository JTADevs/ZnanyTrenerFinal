<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Kreait\Firebase\Firestore;

class FirebaseService
{
    protected Factory $factory;

    public function __construct()
    {
        $this->factory = (new Factory)
            ->withServiceAccount(base_path(env('FIREBASE_CREDENTIALS')));
    }

    public function auth(): Auth
    {
        return $this->factory->createAuth();
    }

    public function firestore(): Firestore
    {
        return $this->factory->createFirestore();
    }
}
