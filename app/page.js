import Image from "next/image";
import UploadButton from "@/lib/components/upload-button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full">
        <div className="flex flex-col pt-24 items-center justify-between gap-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <span className="text-4xl font-bold">Show</span>
            <span className="text-4xl font-bold text-blue-500">Gemini</span>
            <span className="text-4xl font-bold">what you've bought.</span>
          </div>
          
          <UploadButton />
          
        </div>
      </main>
      <footer className="flex flex-col items-start justify-center gap-2 text-gray-500">
        <p className="text-lg">
          Created with Gemini 2.0 flash exp.
        </p>
        <Link 
          href="https://twitter.com/GojyuuPlusOne" 
          target="_blank" 
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          @GojyuuPlusOne
        </Link>
      </footer>
    </div>
  );
}
