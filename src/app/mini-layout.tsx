export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className="bg-white w-full md:w-1/2 lg:w-1/3 flex flex-col mx-auto p-0.2 md:max-xl:border-black border-2
        h-screen relative">
            {children}
        </div>
    );
}