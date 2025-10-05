<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Repository\AuthInterface;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $auth;
    
    public function __construct(AuthInterface $auth)
    {
        $this->auth = $auth;
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        $data = [
            'email' => $request->email,
            'password' => $request->password
        ];

        $message = $this->auth->login($data);

        if (isset($message['error'])) {
            return response()->json($message, 401);
        }

        return response()->json($message, 200);
    }

    public function register(Request $request)
    {
        $validate = $request->validate([
            'fullname' => 'required|string|max:255|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $data = [
            'role' => $request->role,
            'email' => $request->email,
            'password' => $request->password,
            'fullname' => $request->fullname,
            'premium' => $request->premium ?? null
        ];


        $message = $this->auth->register($data);

        if (isset($message['error'])) {
            return response()->json($message, 400);
        }

        return response()->json($message, 201);
    }

    public function loginWithGoogle(Request $request)
    {
        try {
            $data = $request->validate([
                'code' => 'required_without:id_token|string',
                'id_token' => 'required_without:code|string',
                'role' => 'nullable|in:client,trainer', 
                'premium' => 'nullable|date'
            ]);

        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        }

        $message = $this->auth->loginWithGoogle($data);

        if (isset($message['new_user'])) {
            return response()->json($message, 422);
        }

        if (isset($message['error'])) {
            return response()->json($message, 500); 
        }

        return response()->json($message, 200);
    }
    
    public function loginWithApple(Request $request)
    {
        $data = $request->validate([
            'code' => 'required_without:id_token|string',
            'id_token' => 'required_without:code|string',
            'redirectUri' => 'required_with:code|url',
            'role'     => 'nullable|in:client,trainer',
            'premium'  => 'nullable|date',
            'user'     => 'nullable|array'
        ]);

        $message = $this->auth->loginWithApple($data);
        
        if (isset($message['new_user'])) {
            return response()->json($message, 422);
        }
        if (isset($message['error'])) {
            return response()->json(['error' => $message['error']], 401);
        }
        return response()->json($message, 200);
    }
}
