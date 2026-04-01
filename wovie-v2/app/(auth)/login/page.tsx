"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/movies");
      router.refresh();
    }
  };

  return (
    <div
      className="w-[400px] p-10 rounded-2xl border border-white/10"
      style={{
        background: "rgba(22, 41, 56, 0.95)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
      }}
    >
      <h2 className="text-3xl font-logo text-center text-white mb-8">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b-2 border-white/20">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-white outline-none py-2 px-1"
            required
          />
        </div>

        <div className="border-b-2 border-white/20">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-white outline-none py-2 px-1"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-accent text-[#162038] rounded-md font-medium
            hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      <p className="text-accent/80 text-sm text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-white font-semibold hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
