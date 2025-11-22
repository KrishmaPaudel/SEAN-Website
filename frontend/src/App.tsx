import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="text-center max-w-2xl">

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Developers, <span className="text-indigo-400">Welcome</span> 
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-4">
          to the <span className="font-semibold text-indigo-300">Software Department Website</span>
        </p>

   


        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-white font-semibold"
        >
          You clicked {count} times.
        </button>

      </div>
    </div>
  );
}

export default App;
