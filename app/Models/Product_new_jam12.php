<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
    ];

    /**
     * Appends custom attributes to JSON/Array outputs
     *
     * @var array
     */
    protected $appends = ['image', 'price'];

    /**
     * Accessor Image - Mengambil gambar dari relasi productImages
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Ambil data gambar pertama dari relasi productImages
                $firstImage = $this->productImages()->first();

                if ($firstImage && $firstImage->image) {
                    // Jika path sudah berupa URL utuh
                    if (filter_var($firstImage->image, FILTER_VALIDATE_URL)) {
                        return $firstImage->image;
                    }
                    // Jika path berupa nama file di storage
                    return asset('/storage/products/' . $firstImage->image);
                }

                return null;
            }
        );
    }

    /**
     * Accessor Price - Mengambil harga dari relasi productSizes
     */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: function () {
                $firstSize = $this->productSizes()->first();
                if ($firstSize && $firstSize->price) {
                    return $firstSize->price;
                }

                return 0;
            }
        );
    }

    /**
     * category
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * productImages
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * productSizes
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productSizes()
    {
        return $this->hasMany(ProductSize::class);
    }
}
