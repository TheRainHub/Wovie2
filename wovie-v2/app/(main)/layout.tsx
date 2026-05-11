import Header from "@/app/components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 px-4">{children}</main>
    </>
  );
}
