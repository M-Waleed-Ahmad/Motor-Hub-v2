<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // Import the Log facade
use App\Models\Vehicle;
use App\Models\VehicleImage;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
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
    public function create_vehicle(Request $request)
    {
        // Start logging
        $user = $request->user;
        Log::info('Vehicle creation process started.');
        Log::info('Request data:', ['request_data' => $request->all()]);
        Log::info('Creating vehicle entry...', ['user' => $user]); // Pass as an array
      
        Log::info('Checkinfg if request is validated');
        // Log::info('Request validation successful.', ['validated_data' => $request->all()]);
        try {
            // Create a new vehicle entry
            $vehicle = Vehicle::create([
                'user_id' => $request->user, // Assuming authenticated user
                'name' => $request->name,
                'location' => $request->location ?? 'Unknown',
                'registeredIn' => $request->registeredIn ?? 'Unknown',
                'color' => $request->color ?? 'Unknown',
                'model' => $request->model,
                'price' => $request->price,
                'vehicle_type' => $request->vehicle_type,
                'bid' => $request->bid ?? 'no',
                'listing_type' => $request->listing_type ?? 'sale',
                'condition' => $request->condition ?? 5,
                'availability_status' => $request->availability_status ?? 'available',
            ]);

            
    
            Log::info('Vehicle created successfully.', ['vehicle_id' => $vehicle->vehicle_id]);
    
            // Handle the uploaded image
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filePath = $file->store('vehicle_images', 'public'); // Store in "public/vehicle_images"
    
                Log::info('Image uploaded successfully.', ['file_path' => $filePath]);
    
                // Save the image entry in the database
                $vehicleImage = VehicleImage::create([
                    'vehicle_id' => $vehicle->vehicle_id,
                    'image_url' => $filePath,
                ]);
    
                Log::info('Vehicle image saved in the database.', ['vehicle_image_id' => $vehicleImage->id]);
    
                return response()->json([
                    'success' => true,
                    'message' => 'Vehicle and image uploaded successfully.',
                    'data' => [
                        'vehicle' => $vehicle,
                        'image' => $vehicleImage,
                    ],
                ], 201);
            }
    
            // If no image is provided (fallback case)
            Log::warning('Image file is missing.');
            return response()->json([
                'success' => false,
                'message' => 'Image is required but missing.',
            ], 400);
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Error during vehicle creation.', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);
    
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during vehicle creation.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */

     public function show($vehicle_id)
     {
         Log::info("Attempting to retrieve vehicle details", ['vehicle_id' => $vehicle_id]);
     
         // Find the vehicle with its associated images
         $vehicle = Vehicle::with('images')->find($vehicle_id);
     
         if (!$vehicle) {
             Log::warning("Vehicle not found", ['vehicle_id' => $vehicle_id]);
             return response()->json(['error' => 'Vehicle not found'], 404);
         }
     
         // Modify the image URLs to include the public storage path
         $vehicle->images = $vehicle->images->map(function ($image) {
             $image->image_url = asset('storage/vehicle_images/' . basename($image->image_url));
             return $image;
         });
     
         Log::info("Vehicle found and images processed", ['vehicle_id' => $vehicle->vehicle_id]);
     
         return response()->json([
             'vehicle_id' => $vehicle->vehicle_id,
             'name' => $vehicle->name,
             'location' => $vehicle->location,
             'registeredIn' => $vehicle->registeredIn,
             'color' => $vehicle->color,
             'vehicle_type' => $vehicle->vehicle_type,
             'price' => $vehicle->price,
             'created_at' => $vehicle->created_at,
             'images' => $vehicle->images, // Array of image URLs
         ]);
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
