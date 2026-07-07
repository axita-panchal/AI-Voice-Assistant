import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 flex flex-col items-center justify-center px-6 py-12 font-sans text-white">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">
            AI Voice Assistant
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight drop-shadow-sm">
            Talk naturally. Get things done faster.
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            Sign in to your workspace or create an account to start using voice
            powered tools with the same secure experience across every device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
          <Link
            href="/login"
            className="inline-flex justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex justify-center rounded-xl border-2 border-white/80 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Create account
          </Link>
        </div>

        <p className="text-sm text-white/75">
          New here?{" "}
          <Link href="/signup" className="font-medium underline underline-offset-2 hover:text-white">
            Register
          </Link>
          {" · "}
          <Link href="/login" className="font-medium underline underline-offset-2 hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
