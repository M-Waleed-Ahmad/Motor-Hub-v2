<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all users
        $users = User::all();

        // Add profile image URLs to each user
        $users->each(function ($user) {
            $user->profile_image_url = asset('storage/profile_images/' . basename($user->profile_image));;
        });

        return response()->json($users);
    }

    /**
     * Add a new admin.
     */
    public function addAdmin(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:1',
            'phone_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed for adding admin', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create new admin
        $admin = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password_hash' =>$request->password,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'user_type' => 'admin', // Set user_type to 'admin'
        ]);

        \Log::info('Admin added successfully', ['admin' => $admin]);

        return response()->json([
            'message' => 'Admin added successfully',
            'admin' => $admin
        ]);
    }

    /**
     * Approve a user.
     */
    // public function approveUser(string $id)
    // {
    //     Log::info('Attempting to approve user');
    //     Log::info('Attempting to approve user', ['user_id' => $id]);

    //     try {
    //         // Fetch the user
    //         $user = User::find($id);

    //         if (!$user) {
    //             Log::warning('User not found', ['user_id' => $id]);
    //             return response()->json(['error' => 'User not found'], 404);
    //         }

    //         // Approve the user
    //             // Update user`'s approval status
    //             $user->update(['is_approved' => 1]);

    //         Log::info('User approved successfully', ['user_id' => $user]);

    //         return response()->json(['success' => true, 'message' => 'User approved successfully']);
    //     } catch (\Exception $e) {
    //         Log::error('Error approving user', ['user_id' => $id, 'error' => $e->getMessage()]);
    //         return response()->json(['error' => 'Failed to approve user'], 500);
    //     }
    // }


    public function approveUser(string $id)
{
    Log::info('Attempting to approve user', ['user_id' => $id]);

    try {
        $affectedRows = DB::statement('UPDATE users SET is_approved = 1 WHERE user_id = ?', [$id]);

        if (!$affectedRows) {
            Log::warning('User not found or already approved', ['user_id' => $id]);
            return response()->json(['error' => 'User not found or already approved'], 404);
        }

        Log::info('User approved successfully', ['user_id' => $id]);
        return response()->json(['success' => true, 'message' => 'User approved successfully']);
    } catch (\Exception $e) {
        Log::error('Error approving user', ['user_id' => $id, 'error' => $e->getMessage()]);
        return response()->json(['error' => 'Failed to approve user'], 500);
    }
}


    public function removeUserOrAdmin(string $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if the user is an admin
        if ($user->user_type === 'admin') {
            // Delete the admin
            $user->delete();
            return response()->json(['message' => 'Admin removed successfully']);
        }

        // Check if the user has vehicles
        if ($user->vehicles()->count() > 0) {
            return response()->json(['message' => 'User cannot be deleted because they have vehicles'], 400);
        }

        // Delete the user
        $user->delete();
        return response()->json(['message' => 'User removed successfully']);
    }


    public function update(Request $request, $id)
    {
        Log::info('Attempting to update user', ['user_id' => $id]);

        try {
            // Find the user by ID
            $user = User::find($id);
            if (!$user) {
                Log::warning('User not found', ['user_id' => $id]);
                return response()->json(['error' => 'User not found'], 404);
            }

            // Validate incoming data
            $validatedData = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id . ',user_id',
                'password' => 'nullable|string|min:8|max:15',
            ]);

            // Update user details
            $user->full_name = $validatedData['full_name'];
            $user->email = $validatedData['email'];
            $user->password_hash = $validatedData['password'];

            // Optional: Add/update profile image if sent
            if ($request->hasFile('profile_image')) {
                $profileImage = $request->file('profile_image');
                $profileImagePath = $profileImage->store('profile_images', 'public');
                $user->profile_image = $profileImagePath;
            }

            // Save updates
            $user->save();

            Log::info('User updated successfully', ['user_id' => $id]);
            return response()->json(['message' => 'User updated successfully'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed for updating user', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating user', ['user_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update user'], 500);
        }
    }
}
