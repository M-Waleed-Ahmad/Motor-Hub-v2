<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $primaryKey = 'listing_id';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'make',
        'model',
        'year',
        'price',
        'listing_type',
        'availability_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images()
    {
        return $this->hasMany(ListingImage::class, 'listing_id');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class, 'listing_id');
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class, 'listing_id');
    }
}
