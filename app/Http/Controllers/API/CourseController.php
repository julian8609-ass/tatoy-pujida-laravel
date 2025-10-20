<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        return Course::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'code' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $course = Course::create($data);
        return response()->json($course, 201);
    }

    public function show($id)
    {
        return Course::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|required|string',
            'code' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        $course->update($data);
        return response()->json($course);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
