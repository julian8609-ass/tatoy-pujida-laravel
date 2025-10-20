<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'deleted_at')) {
                $table->softDeletes();
            }
        });
        Schema::table('faculties', function (Blueprint $table) {
            if (!Schema::hasColumn('faculties', 'deleted_at')) {
                $table->softDeletes();
            }
        });
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'deleted_at')) $table->dropSoftDeletes();
        });
        Schema::table('faculties', function (Blueprint $table) {
            if (Schema::hasColumn('faculties', 'deleted_at')) $table->dropSoftDeletes();
        });
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'deleted_at')) $table->dropSoftDeletes();
        });
    }
};
