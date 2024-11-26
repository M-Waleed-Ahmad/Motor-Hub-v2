<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\ApiMiddleware;


Route::post('/register', [UserController::class, 'register']);

Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});
Route::post('/login', [UserController::class, 'login']);

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('/', function () {
    return view('welcome');
});
