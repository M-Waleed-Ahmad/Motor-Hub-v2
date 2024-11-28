<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VehicalImageController extends Controller
{
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
        // Validate the request
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle the uploaded image
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filePath = $file->store('vehicle_images', 'public'); // Store in the "public/vehicle_images" directory

            // Save the file path in the database
            $vehicleImage = VehicleImage::create([
                'vehicle_id' => $request->vehicle_id,
                'image_url' => $filePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully.',
                'data' => $vehicleImage,
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to upload image.',
        ], 500);
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
