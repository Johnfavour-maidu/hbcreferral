import Image from "next/image";
import Link from "next/link";

export function AuthBrand() {
  return (
    <div className="flex justify-center mb-8">
      <Link href="/">
        <Image
          src="/assets/logo/logo-horizontal-md.png"
          alt="Hearts by Charming"
          width={130}
          height={34}
          style={{ width: 130, height: "auto" }}
          priority
        />
      </Link>
    </div>
  );
}
