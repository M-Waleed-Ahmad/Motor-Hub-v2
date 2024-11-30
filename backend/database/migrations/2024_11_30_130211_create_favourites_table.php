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
        Schema::create('favourites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Reference to the users table
            $table->unsignedBigInteger('vehicle_id'); // Reference to the vehicles table (or the entity being favorited)
            $table->timestamps();
        
            // Foreign keys for relationships
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('vehicle_id')->on('vehicles')->onDelete('cascade');
        
            // Ensure a user can't favorite the same item multiple times
            $table->unique(['user_id', 'vehicle_id']);
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favourites');
    }
};
