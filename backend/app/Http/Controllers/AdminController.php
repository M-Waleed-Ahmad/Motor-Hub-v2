<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Optionally, you can return all users or admins
        $users = User::all();
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
            'password' => 'required|string|min:8',
            'phone_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create new admin
        $admin = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'user_type' => 'admin', // Set user_type to 'admin'
        ]);

        return response()->json([
            'message' => 'Admin added successfully',
            'admin' => $admin
        ]);
    }

    /**
     * Remove an admin.
     */
    public function removeAdmin(string $id)
    {
        // Find the admin by ID
        $admin = User::find($id);

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        // Ensure the user is an admin
        if ($admin->user_type !== 'admin') {
            return response()->json(['message' => 'User is not an admin'], 400);
        }

        // Delete the admin
        $admin->delete();

        return response()->json([
            'message' => 'Admin removed successfully',
        ]);
    }

    /**
     * Add a new user.
     */
    public function addUser(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create new user
        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'user_type' => 'user', // Set user_type to 'user'
        ]);

        return response()->json([
            'message' => 'User added successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove a user.
     */
    public function removeUser(string $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Delete the user
        $user->delete();

        return response()->json([
            'message' => 'User removed successfully',
        ]);
    }
}
