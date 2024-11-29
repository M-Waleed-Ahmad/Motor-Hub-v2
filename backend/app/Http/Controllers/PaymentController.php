<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Log; // Import the Log facade
use App\Models\User;

class PaymentController extends Controller
{

    public function makePayment(Request $request)
    {
        try {
            // Log the incoming request data
            Log::info('Received payment request', [
                'user_id' => $request->user_id,
                'vehicle_id' => $request->vehicle_id,
                'payment_method' => $request->payment_method,
            ]);
    
            // Fetch the vehicle details
            $vehicle = Vehicle::findOrFail($request->vehicle_id);
    
            // Calculate the amount based on vehicle price (assuming sale context)
            $amount = $vehicle->price;
    
            // Log vehicle details
            Log::info('Vehicle details retrieved', [
                'vehicle_id' => $vehicle->vehicle_id,
                'price' => $vehicle->price,
            ]);
    
            // Create a new payment record
            $payment = Payment::create([
                'user_id' => $request->user_id,
                'vehicle_id' => $request->vehicle_id,
                'payment_method' => $request->payment_method,
                'payment_for' => 'sale', // Defaulting to 'sale'
                'amount' => $amount,
                'payment_status' => 'pending',
            ]);
    
            // Log payment creation
            Log::info('Payment record created', [
                'payment_id' => $payment->id,
                'amount' => $amount,
            ]);
    
            // Update vehicle availability status (mark as sold)
            $vehicle->update(['availability_status' => 'sold']);
            Log::info('Vehicle marked as sold', ['vehicle_id' => $vehicle->vehicle_id]);
    
            // Simulate payment gateway response (success or failure)
            $isPaymentSuccessful = 1;
    
            // Update payment status
        
         
            
            // Update payment status in the database
            Payment::where('payment_id', $payment->payment_id)->update(['payment_status' => $isPaymentSuccessful ? 'completed' : 'failed']);
            // Log payment status update
            Log::info('Payment status updated', [
                'payment_id' => $payment->payment_id,
                'status' => $isPaymentSuccessful ? 'completed' : 'failed',
            ]);
    
            if ($isPaymentSuccessful) {
                // Log successful payment
                Log::info('Payment successful', ['payment_id' => $payment->id]);
    
                return response()->json([
                    'message' => 'Payment successful',
                    'payment' => $payment,
                ], 200);
            }
    
            // Rollback vehicle availability if payment failed
            $vehicle->update(['availability_status' => 'available']);
            Log::warning('Payment failed, vehicle availability reverted', [
                'payment_id' => $payment->id,
                'vehicle_id' => $vehicle->vehicle_id,
            ]);
    
            return response()->json([
                'message' => 'Payment failed',
                'payment' => $payment,
            ], 400);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Log vehicle not found error
            Log::error('Vehicle not found', [
                'vehicle_id' => $request->vehicle_id,
                'error' => $e->getMessage(),
            ]);
    
            return response()->json(['message' => 'Vehicle not found'], 404);
        } catch (\Exception $e) {
            // Log general errors
            Log::error('An error occurred during payment processing', [
                'error' => $e->getMessage(),
            ]);
    
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
    
    
}
