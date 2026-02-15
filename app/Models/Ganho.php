<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ganho extends Model
{
    protected $fillable = ['descricao', 'fonte', 'data', 'valor'];

    protected function casts(): array
    {
        return [
            'data' => 'date',
            'valor' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
