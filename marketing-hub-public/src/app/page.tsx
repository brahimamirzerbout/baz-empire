import { redirect } from "next/navigation";

// Public marketing site — homepage points at the pricing page.
export default function Home() {
  redirect("/pricing");
}