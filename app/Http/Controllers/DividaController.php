<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class DividaController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'descricao' => 'required|string|max:255',
            'destino' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'vencimento' => 'required|string',
            'status' => 'required|string|max:255',
        ]);

        $data['vencimento'] = Carbon::createFromFormat('d/m/Y', $data['vencimento'])->toDateString();

        $request->user()->dividas()->create($data);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $record = $request->user()->dividas()->findOrFail($id);

        $data = $request->validate([
            'descricao' => 'required|string|max:255',
            'destino' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'vencimento' => 'required|string',
            'status' => 'required|string|max:255',
        ]);

        $data['vencimento'] = Carbon::createFromFormat('d/m/Y', $data['vencimento'])->toDateString();

        $record->update($data);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->dividas()->findOrFail($id)->delete();
        return back();
    }
}
