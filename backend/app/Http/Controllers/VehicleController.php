<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // Import the Log facade
use App\Models\Vehicle;
use App\Models\VehicleImage;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info("Attempting to retrieve all vehicles");
        $userId = $request->query('user_id'); // Get user ID from query params

        // Fetch all vehicles with their associated images
        $vehicles = Vehicle::with('images')->get();

        if ($vehicles->isEmpty()) {
            Log::warning("No vehicles found in the database");
            return response()->json(['message' => 'No vehicles available'], 404);
        }

        // Filter and process each vehicle to include the correct public storage path for images
        $vehicles = $vehicles->filter(function ($vehicle) use ($userId) {
            return $vehicle->user_id != $userId;
        })->map(function ($vehicle) {
            $user = User::where('user_id', $vehicle->user_id)->first();
            $owner = [
                'user_id' => $user->user_id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $user->location
            ];
            $vehicle->owner = $owner;
            $vehicle->images = $vehicle->images->map(function ($image) {
                $image->image_url = asset('storage/vehicle_images/' . basename($image->image_url));
                return $image;
            });
            return $vehicle;
        });

        Log::info("Filtered vehicles retrieved successfully");

        return response()->json($vehicles);
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
                'price' => $request->price ?? 0,
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
         $user = User::where('user_id', $vehicle->user_id)->first();
         $owner = [
             'user_id' => $user->user_id,
             'name' => $user->full_name,
             'email' => $user->email,
             'phone' => $user->contact_number,
         ];
         $vehicle->owner = $owner;
     
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
             'condition' => $vehicle->condition,
             'availability_status' => $vehicle->availability_status,
             'listing_type' => $vehicle->listing_type,
             'model' => $vehicle->model,
             'bid' => $vehicle->bid,
             'price' => $vehicle->price,
             'created_at' => $vehicle->created_at,
             'owner' => $vehicle->owner, // Array of owner details
             'images' => $vehicle->images, // Array of image URLs
         ]);
     }
     


     public function getMyListings(Request $request)
     {
         try {
             $userId = $request->query('user_id'); // Get user ID from query params
             $vehicles = Vehicle::withCount('bids') // Count the number of bids on each vehicle
                 ->where('user_id', $userId)
                 ->with('images') // Include images for display
                 ->get();
 
             $vehicles = $vehicles->map(function ($vehicle) {
                 $vehicle->images = $vehicle->images->map(function ($image) {
                     $image->image_url = asset('storage/vehicle_images/' . basename($image->image_url));
                     return $image;
                 });
                 return $vehicle;
             });
 
             return response()->json($vehicles, 200);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Error fetching my listings', 'details' => $e->getMessage()], 500);
         }
     }
 
     // Fetch vehicles the user has bid on
     public function getBidsMade(Request $request)
     {
         try {
             $userId = $request->query('user_id'); // Get user ID from query params
             $vehicles = Vehicle::whereHas('bids', function ($query) use ($userId) {
                 $query->where('bidder_id', $userId);
             })
                 ->with(['bids' => function ($query) use ($userId) {
                     $query->where('bidder_id', $userId); // Fetch user's specific bid
                 }, 'images']) // Include images for display
                 ->get();
 
             $vehicles = $vehicles->map(function ($vehicle) {
                 $vehicle->images = $vehicle->images->map(function ($image) {
                     $image->image_url = asset('storage/vehicle_images/' . basename($image->image_url));
                     return $image;
                 });
                 return $vehicle;
             });
 
             return response()->json($vehicles, 200);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Error fetching bids made', 'details' => $e->getMessage()], 500);
         }
     }
     

    
    public function getRentals(Request $request)
    {
        try {
            $userId = $request->query('user_id'); // Get user ID from query params
            Log::info('Fetching rental vehicles for user', ['user_id' => $userId]);

            // Fetch vehicles owned by the user with listing_type='rent'
            $ownedVehicles = Vehicle::with('images')
                ->where('user_id', $userId)
                ->where('listing_type', 'rent')
                ->get();
            Log::info('Owned rental vehicles fetched', ['count' => $ownedVehicles->count()]);

            // Fetch vehicles bought by the user with listing_type='rent'
            $boughtVehicles = Vehicle::with('images')
                ->whereHas('bids', function ($query) use ($userId) {
                    $query->where('bidder_id', $userId)
                          ->where('bid_status', 'won'); // Assuming 'won' status indicates a successful purchase
                })
                ->where('listing_type', 'rent')
                ->get();
            Log::info('Bought rental vehicles fetched', ['count' => $boughtVehicles->count()]);

            // Merge the collections
            $vehicles = $ownedVehicles->merge($boughtVehicles);
            Log::info('Merged rental vehicles', ['total_count' => $vehicles->count()]);

            // Process each vehicle to include the correct public storage path for images
            $vehicles = $vehicles->map(function ($vehicle) {
                $vehicle->images = $vehicle->images->map(function ($image) {
                    $image->image_url = asset('storage/vehicle_images/' . basename($image->image_url));
                    return $image;
                });
                return $vehicle;
            });
            Log::info('Processed rental vehicles images');

            return response()->json($vehicles, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching rental vehicles', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error fetching rental vehicles', 'details' => $e->getMessage()], 500);
        }
    }



    public function getSales(Request $request)
    {
        try {
            $userId = $request->query('user_id'); // Get user ID from query params
            Log::info('Fetching sale vehicles for user', ['user_id' => $userId]);

            // Fetch vehicles owned by the user with listing_type='sale'
            $ownedVehicles = Vehicle::with('images')
                ->where('user_id', $userId)
                ->where('listing_type', 'sale')
                ->get();
            Log::info('Owned sale vehicles fetched', ['count' => $ownedVehicles->count()]);

            // Fetch vehicles bought by the user with listing_type='sale'
            $boughtVehicles = Vehicle::with('images')
                ->whereHas('bids', function ($query) use ($userId) {
                    $query->where('bidder_id', $userId)
                          ->where('bid_status', 'won'); // Assuming 'won' status indicates a successful purchase
                })
                ->where('listing_type', 'sale')
                ->get();
            Log::info('Bought sale vehicles fetched', ['count' => $boughtVehicles->count()]);

            // Merge the collections
            $vehicles = $ownedVehicles->merge($boughtVehicles);
            Log::info('Merged sale vehicles', ['total_count' => $vehicles->count()]);

            // Process each vehicle to include the correct public storage path for images
            $vehicles = $vehicles->map(function ($vehicle) {
                $vehicle->images = $vehicle->images->map(function ($image) {
                    $image->image_url = asset('storage/vehicle_images/' . basename($image->image_url));
                    return $image;
                });
                return $vehicle;
            });
            Log::info('Processed sale vehicles images');

            return response()->json($vehicles, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching sale vehicles', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error fetching sale vehicles', 'details' => $e->getMessage()], 500);
        }
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
    public function destroy($vehicle_id)
    {
        try {
            Log::info("Attempting to delete vehicle", ['vehicle_id' => $vehicle_id]);

            // Find the vehicle
            $vehicle = Vehicle::find($vehicle_id);

            if (!$vehicle) {
                Log::warning("Vehicle not found", ['vehicle_id' => $vehicle_id]);
                return response()->json(['error' => 'Vehicle not found'], 404);
            }

            // Delete associated images from storage and database
            $vehicle->images->each(function ($image) {
                Storage::disk('public')->delete($image->image_url);
                $image->delete();
            });

            // Delete the vehicle
            $vehicle->delete();

            Log::info("Vehicle and associated images deleted successfully", ['vehicle_id' => $vehicle_id]);

            return response()->json(['message' => 'Vehicle deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting vehicle', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Error deleting vehicle', 'details' => $e->getMessage()], 500);
        }
    }
    
}
