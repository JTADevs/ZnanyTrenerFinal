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
    
}
