<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id('vehicle_id');
            // $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');

            $table->string('name', 100);
            $table->string('location',255);
            $table->string('registeredIn',255);
            $table->string('Color',255);
            // $table->string('make', 50);
            $table->string('model', 50);
            // $table->year('year')->check('year >= 1886');
            $table->decimal('price', 18, 2);
            $table->enum('vehicle_type', ['sedans', 'suvs','trucks','bikes','e-cars','sports','new','used']);
            $table->enum('bid', ['yes', 'no']);
            $table->enum('listing_type', ['sale', 'rent']);
            $table->enum('condition',[1,2,3,4,5]);
            $table->enum('availability_status', ['available', 'sold', 'rented'])->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
