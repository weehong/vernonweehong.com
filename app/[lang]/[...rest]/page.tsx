import { notFound } from "next/navigation";

/** Any path no other route matches renders the edition's not-found page. */
export default function CatchAll(): never {
	notFound();
}
