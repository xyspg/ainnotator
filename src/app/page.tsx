"use client"
import Image from "next/image";
import Link from "next/link";
import Uploader from "@/app/components/Uploader";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/app" className="text-2xl underline">
        Go to App
      </Link>
        <Uploader />
    </main>
  );
}
