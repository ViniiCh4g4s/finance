<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class InvestimentoController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'produto' => 'required|string|max:255',
            'empresa' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'quantidade' => 'required|integer|min:1',
            'tipoAtivo' => 'required|string|max:255',
            'provento' => 'nullable|numeric|min:0',
            'frequencia' => 'required|string|max:255',
            'data' => 'required|string',
        ]);

        $request->user()->investimentos()->create([
            'produto' => $data['produto'],
            'empresa' => $data['empresa'],
            'valor' => $data['valor'],
            'quantidade' => $data['quantidade'],
            'tipo_ativo' => $data['tipoAtivo'],
            'provento' => $data['provento'] ?? 0,
            'frequencia' => $data['frequencia'],
            'data' => Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString(),
        ]);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $record = $request->user()->investimentos()->findOrFail($id);

        $data = $request->validate([
            'produto' => 'required|string|max:255',
            'empresa' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'quantidade' => 'required|integer|min:1',
            'tipoAtivo' => 'required|string|max:255',
            'provento' => 'nullable|numeric|min:0',
            'frequencia' => 'required|string|max:255',
            'data' => 'required|string',
        ]);

        $record->update([
            'produto' => $data['produto'],
            'empresa' => $data['empresa'],
            'valor' => $data['valor'],
            'quantidade' => $data['quantidade'],
            'tipo_ativo' => $data['tipoAtivo'],
            'provento' => $data['provento'] ?? 0,
            'frequencia' => $data['frequencia'],
            'data' => Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString(),
        ]);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->investimentos()->findOrFail($id)->delete();
        return back();
    }
}
