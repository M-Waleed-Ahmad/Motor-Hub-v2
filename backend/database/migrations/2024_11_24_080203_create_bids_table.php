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
        Schema::create('bids', function (Blueprint $table) {
            $table->id('bid_id');
            $table->foreignId('listing_id')->constrained('listings','listing_id')->onDelete('cascade');
            $table->foreignId('bidder_id')->constrained('users','user_id')->onDelete('cascade');
            $table->decimal('bid_amount', 18, 2);
            $table->timestamp('bid_time')->useCurrent();
            $table->enum('bid_status', ['active', 'won', 'lost'])->default('active');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};
