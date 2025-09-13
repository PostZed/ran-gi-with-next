'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {


  return (<div className="w-full bg-white my-auto shadow-md">
    <h2 className="my-1 px-2">Something went wrong:</h2>

    <p className="p-4 border rounded-md text-gray-500">{error.message}</p>
    <button className="appearance-auto block hover:scale-105 mx-auto p-2 rounded-[15px] bg-amber-300 my-1 text-center" onClick={
      e => reset()
    }>
      Reload
    </button>
  </div>)
}