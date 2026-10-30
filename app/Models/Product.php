<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'weight',
        'image',
        'price',
    ];

    protected $appends = ['image', 'price', 'colors', 'sizes'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productSizes()
    {
        return $this->hasMany(ProductSize::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Accessor untuk daftar warna (colors) dari relasi productImages
     */
    protected function colors(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->productImages->map(function ($img) {
                    return [
                        'color' => $img->color->name ?? '',
                        'image' => $img->color->image ?? '',
                    ];
                })->unique('color')->values();
            }
        );
    }

    /**
     * Accessor untuk daftar ukuran (sizes) dari relasi productSizes
     */
    protected function sizes(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->productSizes->map(function ($size) {
                    return [
                        'size'  => $size->size,
                        'price' => $size->price,
                    ];
                })->values();
            }
        );
    }

    /**
     * Accessor URL Gambar
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if ($value) {
                    return asset('/storage/products/' . $value);
                }

                $firstImage = $this->productImages()->first();
                if ($firstImage && $firstImage->image) {
                    return asset('/storage/products/' . $firstImage->image);
                }

                return asset('/assets/images/placeholder.png');
            }
        );
    }

    /**
     * Accessor Harga
     */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if ($value && $value > 0) {
                    return (int) $value;
                }

                $minPrice = $this->productSizes()->min('price');
                return $minPrice ? (int) $minPrice : 0;
            }
        );
    }
}