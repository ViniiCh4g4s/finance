<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FonteRendaController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'meta_anual' => 'nullable|numeric|min:0',
        ]);

        $request->user()->fontesRenda()->create($data);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $record = $request->user()->fontesRenda()->findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'meta_anual' => 'nullable|numeric|min:0',
        ]);

        $record->update($data);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->fontesRenda()->findOrFail($id)->delete();
        return back();
    }
}
