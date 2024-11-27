<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\ApiMiddleware;


Route::post('/register', [AuthController::class, 'register']);

Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});
Route::post('/login', [AuthController::class, 'login']);

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('/', function () {
    return view('welcome');
});
