import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] max-xs:h-[calc(100vh-12rem)] w-full text-center">
      <div className="max-w-md max-xs:w-[20rem] px-6 max-xs:px-4 py-12 max-xs:py-10 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          The page you are looking for could not be found. Please check the URL or navigate back to the home page.
        </p>
        <Link
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 mt-6"
          href="/"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}