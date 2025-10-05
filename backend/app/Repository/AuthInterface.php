<?php

namespace App\Repository;

interface AuthInterface
{
    public function login(array $data);
    public function register(array $data);
    public function loginWithGoogle(array $data);
    public function loginWithApple(array $data);
}