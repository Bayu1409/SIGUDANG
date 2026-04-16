<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class LogService
{
    /**
     * Record an activity log.
     * 
     * @param string $activity Description of the action
     * @param string|null $model Model name
     * @param int|null $modelId ID of the related model
     * @param array $properties Additional data
     */
    public static function log($activity, $model = null, $modelId = null, $properties = [])
    {
        if (!Auth::check()) return;

        ActivityLog::create([
            'user_id' => Auth::id(),
            'activity' => $activity,
            'model' => $model,
            'model_id' => $modelId,
            'properties' => $properties,
        ]);
    }
}
