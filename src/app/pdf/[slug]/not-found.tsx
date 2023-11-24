import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function NotFound() {
  return (
    <>
      <div className="p-8 mt-24 md:mt-0 md:p-48 flex flex-col gap-8 items-start">
        <h1 className="font-mono text-5xl font-medium">404 Not Found</h1>
        <p className="text-2xl font-medium font-sans">
          The requested PDF does not exist. Try checking your URL.
        </p>
        <Link href="/">
          <Button color="primary">Go Back</Button>
        </Link>
      </div>
    </>
  );
}
