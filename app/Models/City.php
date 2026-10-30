<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'province_id',
        'name'
    ];
}
