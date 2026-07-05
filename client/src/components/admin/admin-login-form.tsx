"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type TLoginForm = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const { loginAdmin, isLoginLoading, loginError } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: TLoginForm) => {
    loginAdmin(values);
  };

  const errorMessage =
    loginError instanceof Error
      ? loginError.message
      : "Invalid email or password";

  return (
    <div className="w-full max-w-md rounded-3xl border border-site bg-card p-8 shadow-sm">
      <div className="text-center">
        <Link href="/" className="text-2xl font-bold text-highlight">
          Shawon<span className="text-accent">.</span>
        </Link>

        <p className="mt-3 text-sm font-medium text-accent">Admin Login</p>

        <h1 className="mt-3 text-3xl font-bold text-highlight">
          Sign in to dashboard
        </h1>

        <p className="mt-3 text-sm leading-6 text-normal">
          Use your admin credentials to manage portfolio content.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-highlight">
            Email
          </label>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-normal"
              size={18}
            />

            <input
              type="email"
              placeholder="admin@shawon.dev"
              className="w-full rounded-2xl border border-site bg-transparent py-3 pl-11 pr-4 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
              {...register("email")}
            />
          </div>

          {errors.email ? (
            <p className="mt-2 text-xs text-red-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-highlight">
            Password
          </label>

          <div className="relative">
            <LockKeyhole
              className="absolute left-4 top-1/2 -translate-y-1/2 text-normal"
              size={18}
            />

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-site bg-transparent py-3 pl-11 pr-4 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
              {...register("password")}
            />
          </div>

          {errors.password ? (
            <p className="mt-2 text-xs text-red-400">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {loginError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoginLoading}>
          {isLoginLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-normal">
        Default seed admin: admin@shawon.dev / admin123456
      </p>
    </div>
  );
}