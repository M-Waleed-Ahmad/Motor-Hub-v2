<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $primaryKey = 'rental_id';

    protected $fillable = [
        'listing_id',
        'renter_id',
        'start_date',
        'end_date',
        'total_rent',
        'status',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }

    public function renter()
    {
        return $this->belongsTo(User::class, 'renter_id');
    }
}
