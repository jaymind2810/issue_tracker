import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../authMutations";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginMutation({ variables: formData });
      const { token, user } = res.data.tokenAuth;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        {error && <p className="text-red-500 text-sm mb-2">Invalid credentials</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
