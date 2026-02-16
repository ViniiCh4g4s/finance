<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class GanhoController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'descricao' => 'required|string|max:255',
            'fonte' => 'required|string|max:255',
            'data' => 'required|string',
            'valor' => 'required|numeric|min:0',
            'dataLimite' => 'nullable|string',
        ]);

        $dataGanho = Carbon::createFromFormat('d/m/Y', $data['data']);
        $dataLimite = !empty($data['dataLimite'])
            ? Carbon::createFromFormat('m/Y', $data['dataLimite'])->startOfMonth()
            : null;

        unset($data['dataLimite']);
        $data['data'] = $dataGanho->toDateString();

        if ($dataLimite && $dataLimite->gte($dataGanho->copy()->startOfMonth())) {
            $current = $dataGanho->copy();
            while ($current->copy()->startOfMonth()->lte($dataLimite)) {
                $rec = $data;
                $rec['data'] = $current->toDateString();
                $request->user()->ganhos()->create($rec);
                $current->addMonth();
            }
        } else {
            $request->user()->ganhos()->create($data);
        }

        return back();
    }

    public function update(Request $request, int $id)
    {
        $ganho = $request->user()->ganhos()->findOrFail($id);

        $data = $request->validate([
            'descricao' => 'required|string|max:255',
            'fonte' => 'required|string|max:255',
            'data' => 'required|string',
            'valor' => 'required|numeric|min:0',
        ]);

        $data['data'] = Carbon::createFromFormat('d/m/Y', $data['data'])->toDateString();

        $ganho->update($data);

        return back();
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->ganhos()->findOrFail($id)->delete();
        return back();
    }
}
