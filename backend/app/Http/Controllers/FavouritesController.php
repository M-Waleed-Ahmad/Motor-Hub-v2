<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Favourites;

class FavouritesController extends Controller
{
    public function addToFavourites(Request $request)
    {
        Log::info('addToFavourites called');

        Log::info('addToFavourites called', ['request' => $request->all()]);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
        ]);

        $favourite = Favourites::firstOrCreate([
            'user_id' => $request->user_id,
            'vehicle_id' => $request->vehicle_id,
        ]);

        Log::info('Favourite added', ['favourite' => $favourite]);

        return response()->json(['success' => true, 'message' => 'Added to favourites', 'favourite' => $favourite]);
    }
    

    public function removeFromFavourites(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
        ]);
    
        Favourites::where('user_id', $request->user_id)
                 ->where('vehicle_id', $request->vehicle_id)
                 ->delete();
    
        return response()->json(['success' => true, 'message' => 'Removed from favourites']);
    }
    

    public function getFavourites(Request $request)
    {
        Log::info('getFavourites called', ['request' => $request->all()]);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
        ]);

        $favourites = Favourites::where('user_id', $request->user_id)
                               ->with('vehicle') // Load vehicle details
                               ->get();
                            $favourites->each(function ($favourite) {
                                $vehicleImage = $favourite->vehicle->images()->first();
                                if ($vehicleImage) {
                                $favourite->vehicle_image_url = url('storage/' . $vehicleImage->image_url);
                                } else {
                                $favourite->vehicle->image_url = null;
                                }
                            });
        Log::info('Favourites retrieved', ['favourites' => $favourites,]);

        return response()->json(['success' => true, 'favourites' => $favourites]);
    }
    
    public function checkFavoriteStatus(Request $request)
    {
        Log::info('checkFavoriteStatus called', ['request' => $request->all()]);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
        ]);

        // Check if the vehicle is already marked as a favorite by the user
        $isFavorite = Favourites::where('user_id', $request->user_id)
                               ->where('vehicle_id', $request->vehicle_id)
                               ->exists();

        Log::info('Favorite status checked', ['is_favorite' => $isFavorite]);

        return response()->json(['is_favorite' => $isFavorite]);
    }

}
