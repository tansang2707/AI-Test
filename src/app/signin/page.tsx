"use client";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface SignInForm {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export default function SignInPage() {
  const router = useRouter();
  const form = useForm<SignInForm>();
  
  const onSubmit = async (data: SignInForm) => {
    try {
      const response = await axios.post<LoginResponse>(
        "https://internal.c98staging.dev/api/user/login_09392983",
        {
          id: data.email,
          password: data.password,
        }
      );

      if (!response.data?.token) {
        throw new Error("Invalid response format");
      }

      try {
        localStorage.setItem("jwt_adapter", response.data.token);
        localStorage.setItem("jwt", response.data.token);
        router.push("/");
      } catch (storageError) {
        toast.error("Failed to save login data. Please enable local storage.");
        return;
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[400px] p-8 rounded-lg bg-black/50">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/coin98-logo.png"
            alt="Coin98 Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-white">COIN98 ADMIN</h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...form.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full h-10 px-3 rounded bg-gray-800 text-white border border-gray-700"
            />
            {form.formState.errors.email && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...form.register("password", { required: "Password is required" })}
              className="w-full h-10 px-3 rounded bg-gray-800 text-white border border-gray-700"
            />
            {form.formState.errors.password && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            disabled={form.formState.isSubmitting}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
