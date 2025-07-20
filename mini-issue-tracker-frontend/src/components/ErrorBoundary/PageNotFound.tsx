import { useNavigate } from "react-router"

export default function PageNotFound() {

  const navigate = useNavigate()

  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="border border-gray-200 p-16 rounded-lg text-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              onClick={() => navigate('/')}
              className="bg-gray-800 flex items-center justify-center cursor-pointer rounded-lg bg-primary-700 px-5 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:bg-indigo-700"
            >
              Go back home
            </a>
            <a
              onClick={() => navigate('/contact-us')} 
              className="bg-gray-300 duration-500 flex font-semibold hover:bg-indigo-100 cursor-pointer items-center justify-center px-5 py-2 rounded-lg rounded-md text-sm transition-all cursor-pointer"
              >
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
  