"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button, Card } from "@/components/ui";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card variant="bordered" className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Not Authenticated</h2>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <Button onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.firstName || "Learner"}! 🎉
            </h1>
            <p className="text-gray-600">
              Ready to continue your Python journey?
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="bordered" className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {user.totalXp}
            </div>
            <div className="text-gray-600">Total XP</div>
          </Card>

          <Card variant="bordered" className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {user.streak}
            </div>
            <div className="text-gray-600">Day Streak</div>
          </Card>

          <Card variant="bordered" className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {user.currentChapter}
            </div>
            <div className="text-gray-600">Current Chapter</div>
          </Card>
        </div>

        <Card variant="bordered" className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
            <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
