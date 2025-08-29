import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-[100vh] w-full flex justify-center items-center">

        <div className="bg-white px-10 py-5 rounded-md">
          <Link href="/login">IR PARA LOGIN</Link>
        </div>
      </div>
    </>
  );
}
