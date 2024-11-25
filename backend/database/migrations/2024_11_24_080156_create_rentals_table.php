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
        Schema::create('rentals', function (Blueprint $table) {
            $table->id('rental_id');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles','vehicle_id')->onDelete('set null');
            $table->foreignId('renter_id')->nullable()->constrained('users','user_id')->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_rent', 18, 2);
            $table->enum('status', ['requested', 'confirmed', 'completed', 'canceled'])->default('requested');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
