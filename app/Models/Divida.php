<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Divida extends Model
{
    protected $fillable = ['descricao', 'destino', 'valor', 'vencimento', 'status'];

    protected function casts(): array
    {
        return [
            'vencimento' => 'date',
            'valor' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
