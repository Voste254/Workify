import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = (e: any) => {
    e.preventDefault();
    navigate("/jobs");
  };

  return (
    <form className="space-y-4" onSubmit={handleLogin}>

      <input
        type="email"
        required
        placeholder="Email Address"
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="password"
        required
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
      />

      <button className="w-full py-3 bg-green-600 text-white rounded-lg">
        Login
      </button>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <button className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 hover:bg-gray-50">
        <FcGoogle size={22} />
        Continue with Google
      </button>

    </form>
  );
};

export default LoginForm;