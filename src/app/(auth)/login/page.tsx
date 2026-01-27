import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - Visual Python Learning",
  description: "Sign in to your account and continue learning Python",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visual Python Learning
          </h1>
          <p className="text-gray-600">
            Learn Python by seeing how your code executes
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
