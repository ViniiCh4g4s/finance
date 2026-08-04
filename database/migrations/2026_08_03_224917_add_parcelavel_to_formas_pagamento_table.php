<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{DB, Schema};

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('formas_pagamento', function (Blueprint $table) {
            $table->boolean('parcelavel')->default(false)->after('limite_anual');
        });

        // Preserva o comportamento anterior, que liberava parcelas pelo nome da forma
        DB::table('formas_pagamento')
            ->where('nome', 'like', '%rédito%')
            ->update(['parcelavel' => true]);
    }

    public function down(): void
    {
        Schema::table('formas_pagamento', function (Blueprint $table) {
            $table->dropColumn('parcelavel');
        });
    }
};
