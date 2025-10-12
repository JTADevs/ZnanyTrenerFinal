<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repository\UserInterface;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    protected UserInterface $user;

    public function __construct(UserInterface $user)
    {
        $this->user = $user;
    }

    public function edit(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'uid'           => 'required|string',
                'displayName'   => 'required|string|max:255',
                'email'         => 'required|email',
                'city'          => 'nullable|string|max:255',
                'phone'         => 'nullable|string|max:255',
                'facebook'      => 'nullable|string',
                'instagram'     => 'nullable|string',
                'website'       => 'nullable|string',
                'categories'    => 'nullable|array'
            ]);

            $updatedUser = $this->user->updateUser($validatedData['uid'], $validatedData);

            if ($updatedUser) {
                return response()->json([
                    'user' => $updatedUser,
                    'message' => 'Profil został pomyślnie zaktualizowany!'
                ], 200);
            }

            return response()->json(['message' => 'Wystąpił błąd podczas aktualizacji profilu.'], 500);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
}