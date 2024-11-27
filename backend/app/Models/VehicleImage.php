<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'image_id';

    protected $fillable = [
        'vehicle_id',
        'image_url',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'listing_id');
    }
}
