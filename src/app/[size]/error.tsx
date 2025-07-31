'use client' ;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}){


    return (<div className="w-full md:w-1/3 bg-blue-200 rounded-lg mx-auto
    border-black border-4 shadow-md">
        <h2>Something went wrong.</h2>
        <p>Check your network connection<b/>
        and try again.</p>
        <button className="appearance-none" onClick={
            e=>reset()
        }>
            Reload
        </button>
    </div>)
}