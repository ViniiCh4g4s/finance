<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    public function ganhos(): HasMany { return $this->hasMany(Ganho::class); }
    public function despesasFixas(): HasMany { return $this->hasMany(DespesaFixa::class); }
    public function despesasVariaveis(): HasMany { return $this->hasMany(DespesaVariavel::class); }
    public function dividas(): HasMany { return $this->hasMany(Divida::class); }
    public function investimentos(): HasMany { return $this->hasMany(Investimento::class); }
    public function metas(): HasMany { return $this->hasMany(Meta::class); }
    public function fontesRenda(): HasMany { return $this->hasMany(FonteRenda::class); }
    public function categorias(): HasMany { return $this->hasMany(Categoria::class); }
    public function formasPagamento(): HasMany { return $this->hasMany(FormaPagamento::class); }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
