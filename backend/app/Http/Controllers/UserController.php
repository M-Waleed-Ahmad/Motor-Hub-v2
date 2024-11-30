<?php

namespace App\Http\Controllers;

use App\Models\User; // Add this line to import the User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // Add this line to import the Validator facade
use Illuminate\Support\Facades\Hash; // Add this line to import the Hash facade
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    
    public function updateProfile(Request $request)
    {
        try {
            Log::info('Updating profile', ['user_id' => $request->user_id]);

            $validated = $request->validate([
                'user_id' => 'required|exists:users,user_id',
                // Dynamically validate fields being updated
                'full_name' => 'nullable|string|max:50',
                'email' => 'nullable|string|email|max:100|unique:users,email,' . $request->user_id . ',user_id',
                'phone_number' => 'nullable|string|max:15',
                'address' => 'nullable|string|max:255',
            ]);

            $user = User::find($request->user_id);

            // Update user fields
            Log::info('Updating profile fields', ['user_id' => $validated]);
            foreach ($validated as $key => $value) {
                if ($key !== 'user_id' && $value !== null) {
                    $user->$key = $value;
                }
            }

            $user->save();

            Log::info('Profile updated successfully', ['user_id' => $user->user_id]);

            return response()->json(['success' => true, 'message' => 'Profile updated successfully', 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('Error updating profile', [
                'exception' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return response()->json(['success' => false, 'message' => 'Failed to update profile'], 500);
        }
    }


    public function updateProfileImage(Request $request)
    {
        try {
            Log::info('Updating profile image', ['user_id' => $request->user_id]);
    
            // Validate the request
            $validated = $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'profile_image' => 'required|image|mimes:jpeg,png,jpg|max:6048',
            ]);
    
            $user = User::find($request->user_id);
    
            // Handle the new image upload
            if ($request->hasFile('profile_image')) {
                // Delete the existing profile image if it exists
                if ($user->profile_image) {
                    $existingImagePath = str_replace('/storage/', '', $user->profile_image);
                    if (Storage::exists('public/' . $existingImagePath)) {
                        Storage::delete('public/' . $existingImagePath);
                        Log::info('Old profile image deleted', ['user_id' => $user->user_id]);
                    }
                }
    
                // Store the new image in "public/profile_images"
                $file = $request->file('profile_image');
                $filePath = $file->store('profile_images', 'public'); // Save in "storage/app/public/profile_images"
                $imageUrl = Storage::url($filePath); // Generate URL for the stored image
    
                // Update the user's profile_image field
                $user->profile_image = $imageUrl;
                $user->save();
    
                Log::info('Profile image updated successfully', [
                    'user_id' => $user->user_id,
                    'file_path' => $filePath,
                    'image_url' => $imageUrl,
                ]);
    
                return response()->json([
                    'success' => true,
                    'message' => 'Profile image updated successfully',
                    'image_url' => $imageUrl,
                ]);
            } else {
                Log::warning('No profile image uploaded', ['user_id' => $user->user_id]);
                return response()->json(['success' => false, 'message' => 'No profile image uploaded'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error updating profile image', [
                'exception' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);
    
            return response()->json(['success' => false, 'message' => 'Failed to update profile image'], 500);
        }
    }
    
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
