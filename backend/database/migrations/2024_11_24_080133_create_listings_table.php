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
        Schema::create('listings', function (Blueprint $table) {
            $table->id('listing_id');
            // $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');

            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->string('make', 50);
            $table->string('model', 50);
            $table->year('year')->check('year >= 1886');
            $table->decimal('price', 18, 2);
            $table->enum('listing_type', ['sale', 'rent']);
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
