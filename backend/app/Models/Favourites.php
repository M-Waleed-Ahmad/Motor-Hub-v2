<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favourites extends Model
{
    protected $fillable = ['user_id', 'vehicle_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }
}
