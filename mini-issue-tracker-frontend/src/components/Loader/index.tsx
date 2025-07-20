import React from "react";


const Loader = () => {
    // const loader = useSelector((state: State) => state.loader.isLoading)

    // console.log(loader, "------loader-------------")
    return (
        // loader && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="flex flex-col items-center">
                    <svg
                    className="animate-spin h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                    </svg>
                    <p className="mt-4 text-white text-lg font-medium">Loading...</p>
                </div>
            </div>
        )
    // );
  };
  
  export default Loader;