<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormaPagamento extends Model
{
    protected $table = 'formas_pagamento';

    protected $fillable = ['nome', 'limite_anual'];

    protected function casts(): array
    {
        return [
            'limite_anual' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
