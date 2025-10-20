<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\FacultyController;
use App\Http\Controllers\API\CourseController;

Route::apiResource('students', StudentController::class);
Route::apiResource('faculty', FacultyController::class);
Route::apiResource('courses', CourseController::class);

// Archived endpoints expected by the frontend helper
Route::get('/{resource}/archived', function ($resource) {
    $map = [
        'students' => \App\Models\Student::class,
        'faculty' => \App\Models\Faculty::class,
        'courses' => \App\Models\Course::class,
    ];
    if (!isset($map[$resource])) return response()->json(['message' => 'Unknown resource'], 404);
    $model = $map[$resource];
    if (method_exists($model, 'onlyTrashed')) {
        return response()->json($model::onlyTrashed()->get());
    }
    return response()->json([]);
});

Route::post('/{resource}/{id}/archive', function ($resource, $id) {
    $map = [
        'students' => \App\Models\Student::class,
        'faculty' => \App\Models\Faculty::class,
        'courses' => \App\Models\Course::class,
    ];
    if (!isset($map[$resource])) return response()->json(['message' => 'Unknown resource'], 404);
    $model = $map[$resource];
    $item = $model::find($id);
    if (!$item) return response()->json(['message' => 'Not found'], 404);
    $item->delete(); // soft delete
    return response()->json(['message' => 'archived']);
});

Route::post('/{resource}/{id}/unarchive', function ($resource, $id) {
    $map = [
        'students' => \App\Models\Student::class,
        'faculty' => \App\Models\Faculty::class,
        'courses' => \App\Models\Course::class,
    ];
    if (!isset($map[$resource])) return response()->json(['message' => 'Unknown resource'], 404);
    $model = $map[$resource];
    if (!method_exists($model, 'onlyTrashed')) return response()->json(['message' => 'Not supported'], 400);
    $item = $model::onlyTrashed()->where('id', $id)->first();
    if (!$item) return response()->json(['message' => 'Not found'], 404);
    $item->restore();
    return response()->json(['message' => 'unarchived']);
});

Route::delete('/{resource}/{id}', function ($resource, $id) {
    $map = [
        'students' => \App\Models\Student::class,
        'faculty' => \App\Models\Faculty::class,
        'courses' => \App\Models\Course::class,
    ];
    if (!isset($map[$resource])) return response()->json(['message' => 'Unknown resource'], 404);
    $model = $map[$resource];
    // try to find including trashed
    $item = $model::withTrashed()->where('id', $id)->first();
    if (!$item) return response()->json(['message' => 'Not found'], 404);
    // forceDelete if trashed, otherwise soft delete
    if (method_exists($item, 'trashed') && $item->trashed()) {
        $item->forceDelete();
    } else {
        $item->delete();
    }
    return response()->json(['message' => 'Deleted']);
});

// Simple authentication endpoint used by the frontend Login page
use App\Http\Controllers\API\AuthController;
Route::post('/login', [AuthController::class, 'login']);

// Dev-only helper: create a test user (enabled only in local environment)
Route::post('/_create_test_user', function () {
    if (app()->environment() !== 'local') return response()->json(['message' => 'Not allowed'], 403);
    $u = \App\Models\User::first();
    if ($u) return response()->json(['message' => 'User exists', 'user' => $u]);
    $user = \App\Models\User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);
    return response()->json(['message' => 'created', 'user' => $user]);
});

// Dev-only: create a user with name/email/password. Only allowed in local env.
Route::post('/_create_user', function (Illuminate\Http\Request $request) {
    if (app()->environment() !== 'local') return response()->json(['message' => 'Not allowed'], 403);
    $data = $request->only(['name','email','password']);
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
        return response()->json(['message' => 'name,email,password required'], 400);
    }
    if (\App\Models\User::where('email', $data['email'])->exists()) {
        return response()->json(['message' => 'Email already exists'], 409);
    }
    $user = \App\Models\User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
    ]);
    return response()->json(['message' => 'created', 'user' => $user]);
});

