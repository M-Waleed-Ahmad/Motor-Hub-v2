<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

use Illuminate\Support\Facades\Log; // Import the Log facade

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:50',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:1',
            'phone_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the user

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password_hash' => $request->password,
            'phone_number' => $request->phone_number,
            'user_type' => 'user', // Default type
            'is_approved' => 0, // Not approved by default
        ]);

        // Return a success response
        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:100',
            'password' => 'required|string|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Check if the user exists
        $user = User::where('email', $request->email)->first();
        if (!$user || $user->password_hash !== $request->password) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
    
        // Generate a random token manually
        $token = bin2hex(random_bytes(40)); // Generate an 80-character token
    
        // Optionally store the token in the database for later validation
        // $user->api_token = $token;
        // $user->save();

        // Creating image url for profile_image
        $user->profile_image = url('storage/profile_images/' . basename($user->profile_image));
        
        Log::info('User logged in successfully.', ['user_id' => $user]);
        // Return success response with the token
        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ], 200);
    }
    
    public function logout(Request $request)
    {
        // For simplicity, assume the token is just deleted client-side
        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
