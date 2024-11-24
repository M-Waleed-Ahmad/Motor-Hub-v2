<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    use HasFactory;

    protected $primaryKey = 'bid_id';

    protected $fillable = [
        'listing_id',
        'bidder_id',
        'bid_amount',
        'bid_status',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }

    public function bidder()
    {
        return $this->belongsTo(User::class, 'bidder_id');
    }
}
