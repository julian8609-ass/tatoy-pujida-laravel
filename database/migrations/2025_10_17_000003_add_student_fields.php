<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'roll')) {
                $table->string('roll')->nullable()->after('email');
            }
            if (!Schema::hasColumn('students', 'year')) {
                $table->string('year')->nullable()->after('roll');
            }
            if (!Schema::hasColumn('students', 'semester')) {
                $table->string('semester')->nullable()->after('year');
            }
            if (!Schema::hasColumn('students', 'batch')) {
                $table->string('batch')->nullable()->after('semester');
            }
        });
    }

    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'batch')) $table->dropColumn('batch');
            if (Schema::hasColumn('students', 'semester')) $table->dropColumn('semester');
            if (Schema::hasColumn('students', 'year')) $table->dropColumn('year');
            if (Schema::hasColumn('students', 'roll')) $table->dropColumn('roll');
        });
    }
};
