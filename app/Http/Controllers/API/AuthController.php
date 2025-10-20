<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Login and return a sanctum token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // allow login via email, name or numeric id
        $identifier = trim($request->email);

        $user = null;
        // email
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $identifier)->first();
        } elseif (is_numeric($identifier)) {
            $user = User::find(intval($identifier));
        } else {
            // case-insensitive name match
            $user = User::whereRaw('LOWER(name) = ?', [Str::lower($identifier)])->first();
        }

        // log attempt context (do not include the password)
        $ctx = [
            'identifier' => $identifier,
            'ip' => $request->ip(),
            'user_found' => $user ? $user->id : null,
        ];

        if (!$user) {
            Log::warning('Login attempt failed - user not found', $ctx);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $passwordMatches = Hash::check($request->password, $user->password);
        $ctx['password_matches'] = $passwordMatches;
        if (!$passwordMatches) {
            Log::warning('Login attempt failed - wrong password', $ctx);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        Log::info('Login success', $ctx);

        // create token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }
}
