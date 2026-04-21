import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="px-8 py-4">
      <Link href="/" className="font-bold text-lg tracking-tight" style={{ background: "linear-gradient(to right, #f472b6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Worthit ✦
      </Link>
    </nav>
  );
}