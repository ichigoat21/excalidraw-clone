import Link from "next/link";

const Homepage = () => {
  return (
    <div className="bg-gradient-to-t from-zinc-900 to-zinc-700 h-screen w-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4 tracking-tight">
        Collaborative Canvas
      </h1>

      <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 mb-8 sm:mb-12 font-light max-w-xl">
        Create, collaborate, and connect in real-time
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm mx-auto">
        <Link href="/signup">
          <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium">
            Sign Up
          </button>
        </Link>
        <Link href="/signin">
          <button className="w-full sm:w-auto px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
