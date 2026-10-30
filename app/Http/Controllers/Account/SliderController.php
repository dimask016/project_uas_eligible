<?php

namespace App\Http\Controllers\Account;

use App\Models\Slider;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;


class SliderController extends Controller implements HasMiddleware
{
        /**
     * middleware
     *
     * @return array
     */
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:sliders.index'], only: ['index']),
            new Middleware(['permission:sliders.create'], only: ['store']),
            new Middleware(['permission:sliders.delete'], only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get sliders
        $sliders = Slider::latest()->paginate(5);

        //return inertia
        return inertia('Account/Sliders/Index', [
            'sliders' => $sliders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        /**
         * Validate request
         */
        $request->validate([
            'link'      => 'required',
            'image'     => 'required|mimes:png,jpg',
        ]);

        //upload image
        $image = $request->file('image');
        $image->storeAs('sliders', $image->hashName(), 'public');

        //create slider
        Slider::create([
            'link'  => $request->link,
            'image' => $image->hashName()
        ]);

        //redirect
        return redirect()->route('account.sliders.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //find slider by ID
        $slider = Slider::findOrFail($id);

        //remove image from server
        Storage::disk('public')->delete('sliders/'.basename($slider->image));

        //delete slider
        $slider->delete();

        //redirect
        return redirect()->route('account.sliders.index');
    }
}
