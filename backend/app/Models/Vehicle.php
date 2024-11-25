<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $primaryKey = 'vehicle_id';

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
        return $this->hasMany(VehicleImage::class, 'vehicle_id');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class, 'vehicle_id');
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class, 'vehicle_id');
    }
}
