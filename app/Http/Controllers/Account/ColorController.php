<?php

namespace App\Http\Controllers\Account;

use App\Models\Color;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ColorController extends Controller implements HasMiddleware
{
    /**
     * middleware
     *
     * @return array
     */
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:colors.index'], only: ['index']),
            new Middleware(['permission:colors.create'], only: ['create', 'store']),
            new Middleware(['permission:colors.edit'], only: ['edit', 'update']),
            new Middleware(['permission:colors.delete'], only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get colors
        $colors = Color::when(request()->q, function($colors) {
            $colors = $colors->where('name', 'like', '%'. request()->q . '%');
        })->latest()->paginate(5);

        //append query string to pagination links
        $colors->appends(['q' => request()->q]);

        //render with inertia
        return inertia('Account/Colors/Index', [
            'colors' => $colors,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //render with inertia
        return inertia('Account/Colors/Create');
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
            'name'      => 'required',
            'image'     => 'required|mimes:png,jpg',
        ]);

        //upload image
        $image = $request->file('image');
        $image->storeAs('colors', $image->hashName(), 'public');

        //create color
        $color = Color::create([
            'name'  => $request->name,
            'image' => $image->hashName()
        ]);

        //redirect
        return redirect()->route('account.colors.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //get color
        $color = Color::findOrFail($id);

        //render with inertia
        return inertia('Account/Colors/Edit', [
            'color'          => $color,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Color $color)
    {
        /**
         * validate request
         */
        $request->validate([
            'name'      => 'required',
        ]);

        //check image update
        if ($request->file('image')) {

            //remove old image
            Storage::disk('public')->delete('colors/'.basename($color->image));
        
            //upload new image
            $image = $request->file('image');
            $image->storeAs('colors', $image->hashName(), 'public');

            //update color with new image
            $color->update([
                'image'=> $image->hashName(),
                'name' => $request->name,
            ]);

        }

        //update color without image
        $color->update([
            'name'          => $request->name,
        ]);

        //redirect
        return redirect()->route('account.colors.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //find color by ID
        $color = Color::findOrFail($id);

        //remove image from server
        Storage::disk('public')->delete('colors/'.basename($color->image));

        //delete color
        $color->delete();

        //redirect
        return redirect()->route('account.colors.index');
    }
}
