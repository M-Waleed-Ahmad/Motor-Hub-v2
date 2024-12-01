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
        Log::info('User registered successfully.', ['user' => $request->full_name]);

        // Create the user

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password_hash' => $request->password,
            'phone_number' => $request->phone_number,
            'user_type' => 'user', // Default type
            'is_approved' => 0, // Not approved by default
        ]);
        // Generate a notification
        $notification = \App\Models\Notification::create([
            'user_id' => $user->user_id,
            'message' => 'Welcome TO Motor Hub.',
            'notification_type' => 'general',
            'is_read' => false,
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
        
        // Generate a notification
        $notification = \App\Models\Notification::create([
            'user_id' => $user->user_id,
            'message' => 'You have successfully logged in.',
            'notification_type' => 'general',
            'is_read' => false,
        ]);

        // Fetch count of the total unread notifications for this user
        $unreadNotificationsCount = \App\Models\Notification::where('user_id', $user->user_id)
            ->where('is_read', false)
            ->count();
        Log::info('User logged in successfully.', ['user_id' => $user->user_id]);
        Log::info('Total unread notifications for user.', ['user_id' => $user->user_id, 'count' => $unreadNotificationsCount]);
        $user->unread_notifications_count = $unreadNotificationsCount;
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

    public function changePassword(Request $request)
    {
        // Validate the request
        $validatedData = $request->validate([
            'email' => 'required|string|email|max:100',
            'password' => 'required|string|min:8', // Enforce a stronger password policy
        ]);
    
        try {
            // Find the user by email
            $user = User::where('email', $validatedData['email'])->first();
    
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
    
            // Hash and update the user's password
            $user->password_hash = ($validatedData['password']);
            $user->save();
    
            // Log the password change
            Log::info('User password changed successfully.', ['email' => $user->email]);
    
            // Return a success response
            return response()->json([
                'message' => 'Password changed successfully.',
            ], 200);
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Error changing password', [
                'email' => $request->email,
                'error_message' => $e->getMessage(),
            ]);
    
            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while changing the password. Please try again.',
            ], 500);
        }
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
