import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md shadow-xl rounded-lg p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6">
          {isLogin
            ? "Login to continue to Workify"
            : "Join Workify to find your next opportunity"}
        </p>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-50 transition">
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* FORM */}
        <form className="space-y-4">

          {/* Name (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Re-enter password"
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-6 text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline font-medium"
          >
            {isLogin ? "Create one" : "Login"}
          </button>
        </p>
      </div>
    </div>
   
    </>
  );
};

export default AuthPage;
