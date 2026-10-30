<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'weight',
        'image',
        'price',
    ];

    /**
     * appends
     * Append accessor agar otomatis terkirim ke Inertia JSON
     *
     * @var array
     */
    protected $appends = ['image', 'price'];

    /**
     * category
     *
     * @return void
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * productSizes
     *
     * @return void
     */
    public function productSizes()
    {
        return $this->hasMany(ProductSize::class);
    }

    /**
     * productImages
     *
     * @return void
     */
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Accessor untuk URL Gambar Utama Produk
     * Memprioritaskan kolom image, jika kosong mengambil dari relasi productImages
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if ($value) {
                    return asset('/storage/products/' . $value);
                }

                // Ambil gambar pertama dari relasi productImages
                $firstImage = $this->productImages()->first();
                if ($firstImage && $firstImage->image) {
                    return asset('/storage/products/' . $firstImage->image);
                }

                return asset('/assets/images/placeholder.png');
            }
        );
    }

    /**
     * Accessor untuk Harga Produk
     * Memprioritaskan kolom price, jika 0/null mengambil harga dari relasi productSizes
     */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if ($value && $value > 0) {
                    return (int) $value;
                }

                // Ambil harga terendah dari varian ukuran jika tersedia
                $minPrice = $this->productSizes()->min('price');
                return $minPrice ? (int) $minPrice : 0;
            }
        );
    }
}