import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <div className="text-center mt-8 pt-6 border-t border-border/40">
      <p className="text-[13px] text-brown-light/60 mb-4">
        {text}{" "}
        <Link href={linkHref} className="text-gold font-medium hover:text-gold-dark transition-colors">
          {linkText}
        </Link>
      </p>
      <p className="text-[11px] text-brown-light/30">
        &copy; {new Date().getFullYear()} Hearts by Charming. All rights reserved.
      </p>
    </div>
  );
}
