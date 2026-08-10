<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lançamentos criados no mesmo lote (recorrência, parcelamento ou assinatura)
 * compartilham um grupo_id, permitindo excluir o item ou o grupo inteiro.
 */
return new class () extends Migration {
    public function up(): void
    {
        Schema::table('ganhos', function (Blueprint $table) {
            $table->uuid('grupo_id')->nullable()->index();
        });

        Schema::table('despesas_fixas', function (Blueprint $table) {
            $table->uuid('grupo_id')->nullable()->index();
        });

        Schema::table('despesas_variaveis', function (Blueprint $table) {
            $table->uuid('grupo_id')->nullable()->index();
        });

        Schema::table('dividas', function (Blueprint $table) {
            $table->uuid('grupo_id')->nullable()->index();
        });

        Schema::table('investimentos', function (Blueprint $table) {
            $table->uuid('grupo_id')->nullable()->index();
        });
    }

    public function down(): void
    {
        foreach (['ganhos', 'despesas_fixas', 'despesas_variaveis', 'dividas', 'investimentos'] as $tabela) {
            Schema::table($tabela, function (Blueprint $table) {
                $table->dropIndex(['grupo_id']);
                $table->dropColumn('grupo_id');
            });
        }
    }
};
