<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\ApiMiddleware;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\BidController;



Route::post('/updateProfile', [UserController::class, 'updateProfile']);
Route::post('/updateProfileImage', [UserController::class, 'updateProfileImage']);






Route::post('/register', [AuthController::class, 'register']);

Route::get('/vehicleBids', [BidController::class, 'fetchVehicleDetails']);
Route::post('/bids', [BidController::class, 'submitBid']);

Route::get('/myListings', [VehicleController::class, 'getMyListings']);

// Get vehicles the user has placed bids on (Bids Made)
Route::get('/bidsMade', [VehicleController::class, 'getBidsMade']);


Route::get('/getBids/{vehicle_id}', [BidController::class, 'getVehicleBids']);
Route::post('/approveBid', [BidController::class, 'approveBid']);
Route::post('/closeBid', [BidController::class, 'closeBid']);



Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/user-update',[UserController::class,'update']);

Route::post('/vehicle-register',[VehicleController::class,'create_vehicle']);
Route::get('/vehicles',[VehicleController::class,'index']);
Route::get('/vehicle/{id}',[VehicleController::class,'show']);


Route::post('/make-payment', [PaymentController::class, 'makePayment']);

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('/', function () {
    return view('welcome');
});
Route::post('/admin/add-admin', [AdminController::class, 'addAdmin']);   
Route::delete('/admin/remove-admin/{id}', [AdminController::class, 'removeAdmin']); 
Route::post('/admin/add-user', [AdminController::class, 'addUser']);   
Route::delete('/admin/remove-user/{id}', [AdminController::class, 'removeUser']); 