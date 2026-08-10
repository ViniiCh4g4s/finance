<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormaPagamento extends Model
{
    protected $table = 'formas_pagamento';

    protected $fillable = ['nome', 'icone', 'limite_anual', 'parcelavel'];

    /** @var array<string, string> */
    protected $casts = [
        'limite_anual' => 'decimal:2',
        'parcelavel'   => 'boolean',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
