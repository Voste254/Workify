import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./Login";
import SignupWizard from "./SignupWizard";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md shadow-xl rounded-lg p-8 border border-green-950">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6">
          {isLogin
            ? "Login to continue to Workify"
            : "Join Workify to find your next opportunity"}
        </p>

        {isLogin ? <LoginForm /> : <SignupWizard />}

        {/* Toggle */}
        <p className="text-center mt-6 text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline"
          >
            {isLogin ? "Create one" : "Login"}
          </button>
        </p>

        {/* Back Home */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-sm text-gray-500 hover:text-green-600"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;