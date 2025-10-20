<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index()
    {
        return Student::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'nullable|string',
            'email' => 'nullable|email',
            'class' => 'nullable|string',
            'roll' => 'nullable|string',
            'year' => 'nullable|string',
            'semester' => 'nullable|string',
            'batch' => 'nullable|string',
        ]);
        $student = Student::create($data);
        return response()->json($student, 201);
    }

    public function show($id)
    {
        return Student::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $data = $request->validate([
            'first_name' => 'sometimes|required|string',
            'last_name' => 'nullable|string',
            'email' => 'nullable|email',
            'class' => 'nullable|string',
            'roll' => 'nullable|string',
            'year' => 'nullable|string',
            'semester' => 'nullable|string',
            'batch' => 'nullable|string',
        ]);
        $student->update($data);
        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
