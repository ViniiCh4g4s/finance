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
            'balanco' => 'required|string',
            'parcelas' => 'nullable|integer|min:1|max:12',
        ]);

        $data['data'] = Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString();
        $balancoDate = Carbon::createFromFormat('m/Y', $data['balanco'])->startOfMonth();
        $parcelas = (int) ($data['parcelas'] ?? 1);

        unset($data['balanco'], $data['parcelas']);

        if ($parcelas <= 1) {
            $data['balanco'] = $balancoDate->toDateString();
            $request->user()->despesasVariaveis()->create($data);
        } else {
            $total = (float) $data['valor'];
            $valorParcela = round($total / $parcelas, 2);
            $descOriginal = $data['descricao'];

            for ($i = 0; $i < $parcelas; $i++) {
                $parcelaData = $data;
                $parcelaData['descricao'] = "{$descOriginal} " . ($i + 1) . "/{$parcelas}";
                $parcelaData['balanco'] = $balancoDate->copy()->addMonths($i)->toDateString();
                $parcelaData['valor'] = $valorParcela;

                // Ajustar centavos na última parcela
                if ($i === $parcelas - 1) {
                    $parcelaData['valor'] = round($total - ($valorParcela * ($parcelas - 1)), 2);
                }

                $request->user()->despesasVariaveis()->create($parcelaData);
            }
        }

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
            'balanco' => 'required|string',
        ]);

        $data['data'] = Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString();
        $data['balanco'] = Carbon::createFromFormat('m/Y', $data['balanco'])->startOfMonth()->toDateString();

        $record->update($data);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->despesasVariaveis()->findOrFail($id)->delete();
        return back();
    }
}
