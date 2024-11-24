<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'image_id';

    protected $fillable = [
        'listing_id',
        'image_url',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
