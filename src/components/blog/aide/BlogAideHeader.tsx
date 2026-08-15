import Image from "next/image";
import Link from "next/link";

interface BlogAideHeaderProps {
  onClose: () => void;
}

export default function BlogAideHeader({ onClose }: BlogAideHeaderProps) {
  return (
    <div className="blog_aide_header">
      <Link href="/" className="blog_aide_header_brand">
        <Image src="/favicon/blog/favicon-48x48.png" className="blog_aide_logo" alt="로고" width={40} height={40} unoptimized />
        <span className="blog_aide_header_title">2taeyoon</span>
      </Link>
      <button className="blog_aide_toggle" type="button" onClick={onClose} aria-label="사이드바 접기">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" aria-hidden="true">
          <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
        </svg>
      </button>
    </div>
  );
}
