import dynamic from "next/dynamic";

const BookApp = dynamic(() => import("@/components/BookApp"), { ssr: false });

export default function Home() {
  return <BookApp />;
}
