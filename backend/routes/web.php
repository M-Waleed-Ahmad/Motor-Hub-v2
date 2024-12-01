<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\FavouritesController;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [AuthController::class, 'changePassword']);

// User Routes
Route::post('/updateProfile', [UserController::class, 'updateProfile']);
Route::post('/updateProfileImage', [UserController::class, 'updateProfileImage']);
Route::post('/user-update', [UserController::class, 'update']);

Route::get('/rentals', [VehicleController::class, 'getRentals']);
Route::get('/sales', [VehicleController::class, 'getRentals']);

// Vehicle Routes
Route::post('/vehicle-register', [VehicleController::class, 'create_vehicle']);
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicle/{id}', [VehicleController::class, 'show']);
Route::get('/myListings', [VehicleController::class, 'getMyListings']);
Route::get('/bidsMade', [VehicleController::class, 'getBidsMade']);

// Bid Routes
Route::get('/vehicleBids', [BidController::class, 'fetchVehicleDetails']);
Route::post('/bids', [BidController::class, 'submitBid']);
Route::get('/getBids/{vehicle_id}', [BidController::class, 'getVehicleBids']);
Route::post('/approveBid', [BidController::class, 'approveBid']);
Route::post('/closeBid', [BidController::class, 'closeBid']);

// Favourite Routes
Route::post('/favourites', [FavouritesController::class, 'addToFavourites']);
Route::delete('/favourites', [FavouritesController::class, 'removeFromFavourites']);
Route::get('/favourites', [FavouritesController::class, 'checkFavoriteStatus']);
// In routes/api.php
Route::get('getFavourites', [FavouritesController::class, 'getFavourites']);


// Payment Routes
Route::post('/make-payment', [PaymentController::class, 'makePayment']);

// Admin Routes
Route::post('/admin/addAdmin', [AdminController::class, 'addAdmin']);
Route::get('/admin/users', [AdminController::class, 'index']);
Route::delete('/admin/users/{id}', [AdminController::class, 'removeUserOrAdmin']);
Route::post('/admin/users/approve/{id}', [AdminController::class, 'approveUser']);
Route::put('/admin/users/{id}', [UserController::class, 'update']); // Update user
Route::post('/updateAdminProfile', [UserController::class, 'updateProfile']);
Route::post('/updateAdminProfileImage', [UserController::class, 'updateProfileImage']);
Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

// Miscellaneous Routes
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});
Route::get('/', function () {
    return view('welcome');
});




Route::get('/notifications', [NotificationsController::class, 'index']);
Route::post('/notifications/mark-as-read', [NotificationsController::class, 'markAsRead']);
Route::post('/notifications/mark-all-as-read', [NotificationsController::class, 'markAllAsRead']);
Route::post('/notifications/remove', [NotificationsController::class, 'clearNotification']);
Route::post('/notifications/clear-all', [NotificationsController::class, 'clearAll']);
