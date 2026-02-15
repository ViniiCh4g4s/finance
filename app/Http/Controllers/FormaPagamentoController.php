<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FormaPagamentoController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'icone' => 'nullable|string|max:255',
            'limite_anual' => 'nullable|numeric|min:0',
        ]);

        $request->user()->formasPagamento()->create($data);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $record = $request->user()->formasPagamento()->findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'icone' => 'nullable|string|max:255',
            'limite_anual' => 'nullable|numeric|min:0',
        ]);

        $record->update($data);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->formasPagamento()->findOrFail($id)->delete();
        return back();
    }
}
