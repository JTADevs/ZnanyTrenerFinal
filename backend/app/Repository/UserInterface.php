<?php

namespace App\Repository;

interface UserInterface
{
    public function updateUser(string $uid, array $data);
}