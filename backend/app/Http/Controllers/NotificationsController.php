<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class NotificationsController extends Controller
{
    /**
     * Fetch notifications for a specific user.
     */
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if (!$userId) {
            \Log::error('User ID is required but not provided.');
            return response()->json(['error' => 'User ID is required'], 400);
        }

        \Log::info('Fetching notifications for user ID: ' . $userId);
        $notifications = Notification::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        \Log::info('Fetched ' . $notifications->count() . ' notifications for user ID: ' . $userId);

        return response()->json($notifications, 200);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request)
    {
        $notificationId = $request->notification_id;
        \Log::info('Marking notification as read. Notification ID: ' . $notificationId);
        $notification = Notification::find($notificationId);

        if (!$notification) {
            \Log::error('Notification not found. Notification ID: ' . $notificationId);
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->is_read = true;
        $notification->save();
        \Log::info('Notification marked as read. Notification ID: ' . $notificationId);

        return response()->json(['success' => true, 'message' => 'Notification marked as read'], 200);
    }

    /**
     * Mark all notifications as read for a specific user.
     */
    public function markAllAsRead(Request $request)
    {
        $userId = $request->user_id;
        if (!$userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        Notification::where('user_id', $userId)->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'All notifications marked as read'], 200);
    }

    /**
     * Clear a specific notification.
     */
    public function clearNotification(Request $request)
    {
        $notificationId = $request->notification_id;
        \Log::info('Clearing notification. Notification ID: ' . $notificationId);
        $notification = Notification::find($notificationId);

        if (!$notification) {
            \Log::error('Notification not found. Notification ID: ' . $notificationId);
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->delete();
        \Log::info('Notification cleared. Notification ID: ' . $notificationId);

        return response()->json(['success' => true, 'message' => 'Notification cleared'], 200);
    }

    /**
     * Clear all notifications for a specific user.
     */
    public function clearAll(Request $request)
    {
        $userId = $request->user_id;
        if (!$userId) {
            \Log::error('User ID is required but not provided.');
            return response()->json(['error' => 'User ID is required'], 400);
        }

        \Log::info('Clearing all notifications for user ID: ' . $userId);
        Notification::where('user_id', $userId)->delete();
        \Log::info('All notifications cleared for user ID: ' . $userId);

        return response()->json(['success' => true, 'message' => 'All notifications cleared'], 200);
    }
}
