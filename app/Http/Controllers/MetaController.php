<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class MetaController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
        ]);

        $request->user()->metas()->create($data);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $record = $request->user()->metas()->findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
        ]);

        $record->update($data);

        return back();
    }

    public function investir(Request $request, int $id)
    {
        $meta = $request->user()->metas()->findOrFail($id);

        $data = $request->validate([
            'valor' => 'required|numeric|min:0.01',
            'data' => 'required|string',
        ]);

        $request->user()->investimentos()->create([
            'produto' => $meta->nome,
            'empresa' => '',
            'valor' => $data['valor'],
            'quantidade' => 1,
            'tipo_ativo' => 'Meta Financeira',
            'provento' => 0,
            'frequencia' => '',
            'data' => Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString(),
        ]);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->metas()->findOrFail($id)->delete();
        return back();
    }
}
