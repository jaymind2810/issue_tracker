import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../authMutations";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../store/toast/actions-creation";
import { useDispatch } from "react-redux";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ variables: formData });
      dispatch(successToast({
        toast: true,
        message: "Register Successfully !!",
      }));
      navigate("/");
    } catch (err) {
      dispatch(errorToast({
        toast: true,
        message: `"Register error: ", ${err}`
      }));
    }
  };

  return (
    <>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
      <form
        onSubmit={handleSubmit}
        className=""
      >
        <h2 className="text-2xl font-bold mb-6">Register</h2>
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
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
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
        {error && <p className="text-red-500 text-sm mb-2">Something went wrong</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div
        onClick={()=> {navigate("/")} }
        className="w-full flex bg-gray-100 py-2 rounded-lg font-semibold justify-center cursor-pointer mt-4"
      >
        Do you want to login ?
      </div>
    </div>
    </div>
    </>
  );
};

export default Register;
