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
     * @param int|null $userId Explicit user ID to log for
     */
    public static function log($activity, $model = null, $modelId = null, $properties = [], $userId = null)
    {
        $uid = $userId ?? Auth::id();
        
        if (!$uid) return;

        ActivityLog::create([
            'user_id' => $uid,
            'activity' => $activity,
            'model' => $model,
            'model_id' => $modelId,
            'properties' => $properties,
        ]);
    }
}
