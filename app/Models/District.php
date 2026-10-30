<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'city_id',
        'name'
    ];
}
