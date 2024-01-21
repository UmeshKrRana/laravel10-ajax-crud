<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::resource('todos', TodoController::class);
Route::post('todos/mark-completed', [TodoController::class, 'markAsCompleted'])->name('todos.mark-completed');
Route::post('todos/bulk-delete', [TodoController::class, 'bulkDelete'])->name('todos.bulk-delete');
