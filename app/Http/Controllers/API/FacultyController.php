<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faculty;

class FacultyController extends Controller
{
    public function index()
    {
        return Faculty::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'positions' => 'nullable|string',
            'email' => 'nullable|email',
        ]);
        $faculty = Faculty::create($data);
        return response()->json($faculty, 201);
    }

    public function show($id)
    {
        return Faculty::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'positions' => 'nullable|string',
            'email' => 'nullable|email',
        ]);
        $faculty->update($data);
        return response()->json($faculty);
    }

    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
