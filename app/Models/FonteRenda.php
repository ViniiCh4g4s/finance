<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FonteRenda extends Model
{
    protected $table = 'fontes_renda';

    protected $fillable = ['nome', 'meta_anual'];

    protected function casts(): array
    {
        return [
            'meta_anual' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
