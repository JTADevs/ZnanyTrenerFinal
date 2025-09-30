<?php

namespace App\Repository;

interface AuthInterface
{
    public function login(array $data);
    public function register(array $data);
}