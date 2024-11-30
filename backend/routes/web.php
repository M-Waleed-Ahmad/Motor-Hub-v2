<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\ApiMiddleware;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PaymentController;



Route::post('/register', [AuthController::class, 'register']);

Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});
Route::post('/login', [AuthController::class, 'login']);

Route::post('/user-update',[UserController::class,'update']);

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