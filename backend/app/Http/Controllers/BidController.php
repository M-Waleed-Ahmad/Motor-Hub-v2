<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\Bid;
use Illuminate\Support\Facades\Log;


class BidController extends Controller
{
    /**
     * Fetch vehicle details including bids.
     *
     * @param  int  $vehicle_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchVehicleDetails(Request $request)
    {
        $vehicle_id = $request->input('vehicle_id');
        $user_id = $request->input('user_id');
    
        // Log the start of the method
        Log::info('Fetching vehicle details', ['vehicle_id' => $vehicle_id, 'user_id' => $user_id]);
    
        if (!$vehicle_id || !$user_id) {
            Log::warning('Missing required parameters', ['vehicle_id' => $vehicle_id, 'user_id' => $user_id]);
            return response()->json(['error' => 'Missing required parameters'], 400);
        }
    
        try {
            // Fetch the vehicle and include related bid and user information
            $vehicle = Vehicle::with(['bids', 'user', 'images'])
                ->where('vehicle_id', $vehicle_id)
                ->first();
    
            // Check if the vehicle exists
            if (!$vehicle) {
                Log::warning('Vehicle not found', ['vehicle_id' => $vehicle_id]);
                return response()->json(['error' => 'Vehicle not found'], 404);
            }
    
            Log::info('Vehicle found', [
                'vehicle_id' => $vehicle->vehicle_id,
                'name' => $vehicle->model,
                'owner_id' => $vehicle->user->user_id ?? null,
            ]);
    
            // Calculate highest bid and total bidders
            $highestBid = $vehicle->bids()->max('bid_amount') ?? 0; // Default to 0 if no bids
            $totalBidders = $vehicle->bids()->distinct('bidder_id')->count();
    
            // Fetch user's specific bid for the vehicle
            $userBid = Bid::where('bidder_id', $user_id)
                ->where('vehicle_id', $vehicle_id)
                ->first();
    
            Log::info('Bids calculated', [
                'highest_bid' => $highestBid,
                'user_bid' => $userBid ? $userBid->bid_amount : null,
                'total_bidders' => $totalBidders,
            ]);
    
            // Fetch all images with correct public paths
            $images = $vehicle->images->map(function ($image) {
                return asset('storage/vehicle_images/' . basename($image->image_url));
            });
    
            Log::debug('Vehicle images fetched', ['images' => $images]);
    
            // Prepare the response
            $response = [
                'vehicle_id' => $vehicle->vehicle_id,
                'name' => $vehicle->model,
                'condition' => $vehicle->condition,
                'price' => $vehicle->price,
                'model' => $vehicle->model,
                'location' => $vehicle->location,
                'color' => $vehicle->color,
                'registeredIn' => $vehicle->registered_in,
                'ownerName' => $vehicle->user->full_name,
                'ownerContact' => $vehicle->user->email,
                'images' => $images,
                'highestBid' => $highestBid,
                'totalBidders' => $totalBidders,
                'startingPrice' => $vehicle->price,
                'userBid' => $userBid ? $userBid->bid_amount : null, // Include user's bid if available
            ];
    
            Log::info('Vehicle details prepared', ['response' => $response]);
    
            return response()->json($response);
        } catch (\Exception $e) {
            // Log unexpected errors
            Log::error('Error fetching vehicle details', [
                'vehicle_id' => $vehicle_id,
                'user_id' => $user_id,
                'exception' => $e->getMessage(),
            ]);
    
            return response()->json(['error' => 'An error occurred while fetching vehicle details'], 500);
        }
    }
    /**
     * Submit a bid for a vehicle.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    

    public function submitBid(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
            'amount' => 'required|numeric|min:0.01',
        ]);
    
        $vehicleId = $request->vehicle_id;
        $amount = $request->amount;
        $userId = $request->user_id;
    
        try {
            Log::info('Received bid submission request', [
                'vehicle_id' => $vehicleId,
                'user_id' => $userId,
                'amount' => $amount,
            ]);
    
            $vehicle = Vehicle::find($vehicleId);
            if (!$vehicle) {
                Log::warning('Vehicle not found', ['vehicle_id' => $vehicleId]);
                return response()->json(['error' => 'Vehicle not found'], 404);
            }
    
            $highestBid = Bid::where('vehicle_id', $vehicleId)->max('bid_amount') ?? $vehicle->price;
    
            // Check if bid is higher than the highest bid
            if ($amount <= $highestBid) {
                Log::warning('Invalid bid amount', [
                    'vehicle_id' => $vehicleId,
                    'user_id' => $userId,
                    'amount' => $amount,
                    'highest_bid' => $highestBid,
                ]);
                return response()->json([
                    'error' => 'Bid must be higher than the current highest bid of ' . $highestBid,
                ], 422);
            }
    
            // Check if the user has already placed a bid
            $existingBid = Bid::where('vehicle_id', $vehicleId)->where('bidder_id', $userId)->first();
            if ($existingBid) {
                // Update the existing bid
                $existingBid->update(['bid_amount' => $amount]);
                Log::info('Bid updated successfully', [
                    'vehicle_id' => $vehicleId,
                    'user_id' => $userId,
                    'bid_id' => $existingBid->bid_id,
                    'amount' => $amount,
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Bid updated successfully',
                    'bid' => $existingBid,
                ]);
            }
    
            // Save a new bid to the database
            $bid = Bid::create([
                'vehicle_id' => $vehicleId,
                'bidder_id' => $userId,
                'bid_amount' => $amount,
                'bid_status' => 'active',
            ]);
    
            Log::info('Bid placed successfully', [
                'vehicle_id' => $vehicleId,
                'user_id' => $userId,
                'bid_id' => $bid->bid_id,
                'amount' => $amount,
            ]);
    
            return response()->json([
                'success' => true,
                'message' => 'Bid placed successfully',
                'bid' => $bid,
            ]);
        } catch (\Exception $e) {
            Log::error('Error placing bid', [
                'vehicle_id' => $vehicleId,
                'user_id' => $userId,
                'amount' => $amount,
                'error_message' => $e->getMessage(),
            ]);
    
            return response()->json([
                'error' => 'An error occurred while placing the bid. Please try again later.',
            ], 500);
        }
    }

    public function getVehicleBids($vehicle_id)
    {
        Log::info('Fetching vehicle bids', ['vehicle_id' => $vehicle_id]);

        try {
            // Fetch vehicle details with related bids
            $vehicle = Vehicle::with('bids.bidder')->find($vehicle_id);

            if (!$vehicle) {
                Log::warning('Vehicle not found', ['vehicle_id' => $vehicle_id]);
                return response()->json(['error' => 'Vehicle not found'], 404);
            }

            Log::info('Vehicle found', ['vehicle_id' => $vehicle_id]);

            return response()->json([
                'vehicle' => [
                    'id' => $vehicle->vehicle_id,
                    'name' => $vehicle->name,
                    'availability_status' => $vehicle->availability_status,
                    'price' => $vehicle->price,
                    'image' => $vehicle->images->first()?->image_url,
                ],
                'bids' => $vehicle->bids->map(function ($bid) {
                    return [
                        'id' => $bid->bid_id,
                        'bidder_name' => $bid->bidder->full_name,
                        'bid_amount' => $bid->bid_amount,
                        'bid_status' => $bid->bid_status,
                        'bid_time' => $bid->bid_time,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching vehicle bids', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while fetching vehicle details'], 500);
        }
    }
    public function approveBid(Request $request)
    {

        Log::info('Approving bid');
        $bid_id = $request->bid_id;
        $vehicle_id = $request->id;

        Log::info('Approving bid', ['bid_id' => $bid_id, 'vehicle_id' => $vehicle_id]);

        try {
            // Fetch the bid to approve
            $bid = Bid::where('bid_id', $bid_id)->where('vehicle_id', $vehicle_id)->first();

            if (!$bid) {
                Log::warning('Bid not found', ['bid_id' => $bid_id, 'vehicle_id' => $vehicle_id]);
                return response()->json(['error' => 'Bid not found'], 404);
            }

            // Mark the approved bid as won
            $bid->bid_status = 'won';
            $bid->save();

            Log::info('Bid approved', ['bid_id' => $bid_id]);

            // Mark all other bids as lost
            Bid::where('vehicle_id', $vehicle_id)->where('bid_id', '!=', $bid_id)->update(['bid_status' => 'lost']);

            Log::info('Other bids marked as lost', ['vehicle_id' => $vehicle_id]);

            // Update vehicle availability status
            $vehicle = Vehicle::find($vehicle_id);
            $vehicle->availability_status = 'sold';
            $vehicle->save();

            Log::info('Vehicle marked as sold', ['vehicle_id' => $vehicle_id]);

            return response()->json(['success' => true, 'message' => 'Bid approved successfully.']);
        } catch (\Exception $e) {
            Log::error('Error approving bid', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while approving the bid.'], 500);
        }
    }

    public function closeBid(Request $request)
    {
        $vehicle_id = $request->id;

        Log::info('Closing bids for vehicle', ['vehicle_id' => $vehicle_id]);

        try {
            // Mark all active bids as lost
            Bid::where('vehicle_id', $vehicle_id)->where('bid_status', 'active')->update(['bid_status' => 'lost']);

            // Update vehicle availability status
            $vehicle = Vehicle::find($vehicle_id);
            $vehicle->availability_status = 'sold';
            $vehicle->save();

            Log::info('Bids closed and vehicle marked as unsold', ['vehicle_id' => $vehicle_id]);

            return response()->json(['success' => true, 'message' => 'Bidding closed successfully.']);
        } catch (\Exception $e) {
            Log::error('Error closing bids', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while closing the bids.'], 500);
        }
    }

    
    
}
