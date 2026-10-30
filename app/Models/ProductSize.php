<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'size',
        'price'
    ];
}
