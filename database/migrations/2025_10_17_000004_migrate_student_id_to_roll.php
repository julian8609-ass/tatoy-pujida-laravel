<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // If an old column named student_id exists in the DB, copy it into roll and then drop it.
        if (Schema::hasTable('students')) {
            // ensure roll exists
            if (!Schema::hasColumn('students', 'roll')) {
                Schema::table('students', function (Blueprint $table) {
                    $table->string('roll')->nullable()->after('email');
                });
            }
            // if student_id exists, copy its values into roll and then drop it
            try {
                $hasOld = Schema::hasColumn('students', 'student_id');
                if ($hasOld) {
                    DB::statement('UPDATE students SET roll = student_id WHERE student_id IS NOT NULL');
                    Schema::table('students', function (Blueprint $table) {
                        if (Schema::hasColumn('students', 'student_id')) $table->dropColumn('student_id');
                    });
                }
            } catch (\Exception $e) {
                // if the DB doesn't have student_id or the DB driver forbids the operation, continue safely
            }
        }
    }

    public function down()
    {
        // On rollback, simply drop 'roll' if present. We do not recreate old 'student_id' column automatically.
        if (Schema::hasTable('students') && Schema::hasColumn('students', 'roll')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropColumn('roll');
            });
        }
    }
};
