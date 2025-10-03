<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Repository\AuthInterface;

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
        ];


        $message = $this->auth->register($data);

        if (isset($message['error'])) {
            return response()->json($message, 400);
        }

        return response()->json($message, 201);
    }
    
}
