export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1c2e 50%, #0a0a0a 100%)",
      }}
    >
      {children}
    </div>
  );
}
