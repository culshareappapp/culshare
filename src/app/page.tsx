import Link from 'next/link'; // وارد کردن کامپوننت لینک

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome to CulShare
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Your new home for sharing cultural and artistic interests.
        </p>
        <div className="mt-8">
          <Link href="/login">
            <button className="px-6 py-2 bg-pink-600 rounded-md font-semibold hover:bg-pink-700 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}