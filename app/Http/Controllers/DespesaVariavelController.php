<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class DespesaVariavelController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'descricao' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'data' => 'required|string',
            'forma' => 'nullable|string|max:255',
        ]);

        $data['data'] = Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString();

        $request->user()->despesasVariaveis()->create($data);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $record = $request->user()->despesasVariaveis()->findOrFail($id);

        $data = $request->validate([
            'descricao' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'data' => 'required|string',
            'forma' => 'nullable|string|max:255',
        ]);

        $data['data'] = Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString();

        $record->update($data);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->despesasVariaveis()->findOrFail($id)->delete();
        return back();
    }
}
