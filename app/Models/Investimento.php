<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Investimento extends Model
{
    protected $fillable = ['produto', 'empresa', 'valor', 'quantidade', 'tipo_ativo', 'provento', 'frequencia', 'data'];

    protected function casts(): array
    {
        return [
            'data' => 'date',
            'valor' => 'decimal:2',
            'provento' => 'decimal:2',
            'quantidade' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
