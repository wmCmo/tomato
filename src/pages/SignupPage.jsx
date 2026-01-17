import { useOutletContext } from "react-router";

export default function SignupPage() {
  const { lang, theme } = useOutletContext();

  return (
    <div className="flex flex-col flex-grow max-w-lg w-6/12">
      <div className="bg-neutral-300 px-8 py-6 rounded-lg text-neutral-700 drop-shadow-md">
        <h1 className="text-3xl font-bold">Sign up page</h1>
        <p className="mt-2 text-sm opacity-80">lang: {lang} · theme: {theme}</p>
      </div>
    </div>
  );
}
