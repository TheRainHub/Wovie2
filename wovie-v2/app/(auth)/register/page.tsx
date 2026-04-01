"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    const loginResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (loginResult?.ok) {
      router.push("/movies");
      router.refresh();
    }
  };

  return (
    <div
      className="w-[450px] p-10 rounded-2xl border border-white/10"
      style={{
        background: "rgba(22, 41, 56, 0.95)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
      }}
    >
      <h2 className="text-3xl font-logo text-center text-white mb-8">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border-b-2 border-white/20">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-transparent text-white outline-none py-2 px-1"
            required
          />
        </div>

        <div className="border-b-2 border-white/20">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent text-white outline-none py-2 px-1"
            required
          />
        </div>

        <div className="border-b-2 border-white/20">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-transparent text-white outline-none py-2 px-1"
            required
          />
        </div>

        <div className="border-b-2 border-white/20">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full bg-transparent text-white outline-none py-2 px-1"
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-accent text-[#162038] rounded-md font-medium
            hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-accent/80 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-white font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
