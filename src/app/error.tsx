'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {


  return (<div className="w-full bg-white rounded-lg
    border-black border-4 shadow-md">
    <h2>Something went wrong.</h2>
    <p>Check your network connection and try again.</p>
    <button className="transition duration-300 ease-in-out pl-2 pr-2 border border-black-[1px] rounded-full bg-pink-300
                 hover:bg-pink-500 mx-auto" onClick={
        e => reset()
      }>
      Reload
    </button>
  </div>)
}