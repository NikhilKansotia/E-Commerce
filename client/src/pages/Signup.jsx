import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Signup = () => {
  const navigate = useNavigate();

  //* states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  //* validation handler
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //* event-handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      const trimmedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()])
      );
      const response = await fetch(`${BACKEND_BASE_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedFormData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      toast.success(data.message || "User created succuessfully");
      navigate("/signin");
    } catch (error) {
      console.error("Error in submitting the form: ", error);
      toast.error(error.message || "Error in Signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      submitForm();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-200 via-white to-indigo-200 flex items-center justify-center py-6 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-md"
        noValidate
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">
          Signup
        </h1>
        <div className="mb-5">
          <label
            htmlFor="fullName"
            className="block mb-2 font-semibold text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full bg-gray-50 border ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors`}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-2">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full bg-gray-50 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-2">{errors.email}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full bg-gray-50 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-2">{errors.password}</p>
          )}
        </div>

        <div className="mb-7">
          <label
            htmlFor="Number"
            className="block mb-2 font-semibold text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors`}
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="cursor-pointer w-full bg-linear-to-r from-blue-600 to-purple-700 hover:scale-105 transition-transform text-white font-semibold py-3 rounded-xl shadow-md"
        >
          Sign Up
        </button>
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:underline font-semibold cursor-pointer underline"
          >
            Signin
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Signup;
