<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests cannot access formas-pagamento routes', function () {
    $this->post(route('formas-pagamento.store'))->assertRedirect(route('login'));
    $this->put(route('formas-pagamento.update', 1))->assertRedirect(route('login'));
    $this->delete(route('formas-pagamento.destroy', 1))->assertRedirect(route('login'));
});

test('store creates a forma de pagamento', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('formas-pagamento.store'), [
            'nome'         => 'Pix',
            'icone'        => 'CreditCard',
            'limite_anual' => 20000,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('formas_pagamento', [
        'user_id'      => $user->id,
        'nome'         => 'Pix',
        'icone'        => 'CreditCard',
        'limite_anual' => 20000,
    ]);
});

test('update modifies a forma de pagamento', function () {
    $user  = User::factory()->create();
    $forma = $user->formasPagamento()->create([
        'nome'         => 'Pix',
        'icone'        => 'CreditCard',
        'limite_anual' => 20000,
    ]);

    $this->actingAs($user)
        ->put(route('formas-pagamento.update', $forma->id), [
            'nome'         => 'Boleto',
            'icone'        => 'Receipt',
            'limite_anual' => 10000,
        ])
        ->assertRedirect();

    $forma->refresh();
    expect($forma->nome)->toBe('Boleto');
    expect($forma->icone)->toBe('Receipt');
    expect((float) $forma->limite_anual)->toBe(10000.0);
});

test('destroy deletes a forma de pagamento', function () {
    $user  = User::factory()->create();
    $forma = $user->formasPagamento()->create([
        'nome'         => 'Pix',
        'limite_anual' => 20000,
    ]);

    $this->actingAs($user)
        ->delete(route('formas-pagamento.destroy', $forma->id))
        ->assertRedirect();

    $this->assertDatabaseMissing('formas_pagamento', ['id' => $forma->id]);
});

test('user cannot access another user forma de pagamento', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $forma = $user1->formasPagamento()->create([
        'nome'         => 'Pix',
        'limite_anual' => 20000,
    ]);

    $this->actingAs($user2)
        ->put(route('formas-pagamento.update', $forma->id), [
            'nome' => 'Hack',
        ])
        ->assertNotFound();

    $this->actingAs($user2)
        ->delete(route('formas-pagamento.destroy', $forma->id))
        ->assertNotFound();
});

test('store validates required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('formas-pagamento.store'), ['limite_anual' => -1])
        ->assertSessionHasErrors(['nome', 'limite_anual']);
});

test('store saves the parcelavel flag', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('formas-pagamento.store'), [
            'nome'         => 'Cartão Mercado Pago',
            'icone'        => 'CreditCard',
            'limite_anual' => 15000,
            'parcelavel'   => true,
        ])
        ->assertRedirect();

    $forma = $user->formasPagamento()->firstWhere('nome', 'Cartão Mercado Pago');
    expect($forma->parcelavel)->toBeTrue();
});

test('forma de pagamento defaults to nao parcelavel', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('formas-pagamento.store'), ['nome' => 'Pix'])
        ->assertRedirect();

    expect($user->formasPagamento()->firstWhere('nome', 'Pix')->parcelavel)->toBeFalse();
});

test('update toggles the parcelavel flag', function () {
    $user  = User::factory()->create();
    $forma = $user->formasPagamento()->create(['nome' => 'Cartão Mercado Pago', 'parcelavel' => true]);

    $this->actingAs($user)
        ->put(route('formas-pagamento.update', $forma->id), [
            'nome'       => 'Cartão Mercado Pago',
            'parcelavel' => false,
        ])
        ->assertRedirect();

    expect($forma->refresh()->parcelavel)->toBeFalse();
});

test('home exposes only parcelavel formas in configFormasParcelaveis', function () {
    $user = User::factory()->create();
    $user->formasPagamento()->create(['nome' => 'Cartão Mercado Pago', 'parcelavel' => true]);
    $user->formasPagamento()->create(['nome' => 'Pix', 'parcelavel' => false]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(fn ($page) => $page
            ->where('configFormas', ['Cartão Mercado Pago', 'Pix'])
            ->where('configFormasParcelaveis', ['Cartão Mercado Pago']));
});
