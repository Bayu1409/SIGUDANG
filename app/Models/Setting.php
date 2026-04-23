<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value', 'type'];

    public static function getSetting($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) return $default;

        if ($setting->type === 'json' || $setting->type === 'array') {
            return json_decode($setting->value, true) ?? $default;
        }

        if ($setting->type === 'integer') {
            return (int) $setting->value;
        }

        return $setting->value;
    }

    public static function setSetting($key, $value, $type = 'string')
    {
        if (is_array($value)) {
            $value = json_encode($value);
            $type = 'json';
        }

        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type]
        );
    }
}
