import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account - Visual Python Learning",
  description: "Create your account and start learning Python with visual execution",
};

export default function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  );
}
