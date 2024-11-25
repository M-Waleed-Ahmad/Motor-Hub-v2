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
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');
            $table->foreignId('user_id')->constrained('users','user_id');
            $table->foreignId('vehicle_id')->constrained('vehicles','vehicle_id');
            $table->enum('payment_method', ['credit_card', 'debit_card', 'bank_transfer']);
            $table->enum('payment_for',['rent','sale']);
            $table->decimal('amount', 18, 2);
            $table->timestamp('payment_date')->useCurrent();
            $table->enum('payment_status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
