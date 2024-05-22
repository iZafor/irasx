"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] max-xs:h-[calc(100vh-12rem)] w-full text-center">
            <div className="max-w-md max-xs:w-[20rem] px-6 max-xs:px-4 py-12 max-xs:py-10 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="space-y-4">
                    <TriangleAlertIcon className="mx-auto h-12 w-12 text-red-500" />
                    <h1 className="text-3xl max-xs:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Something went wrong
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        An unexpected error has occurred. Please try again later or contact support if the issue persists.
                    </p>
                    <div className="flex gap-4 w-full items-center justify-center">
                        <Button
                            className="text-base max-xs:text-sm font-semibold p-6 h-[3rem] w-[9rem]"
                            onClick={() => reset()}
                        >
                            Try again
                        </Button>
                        <Link
                            className="inline-flex max-xs:text-sm items-center justify-center p-6 h-[3rem] w-[9rem] bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-non dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 "
                            href="/"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}