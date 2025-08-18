import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-5 sticky h-screen top-0">
      <div className="mt-20 space-y-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          <ChartNoAxesColumn
            size={24}
            className="text-gray-800 dark:text-gray-200"
          />
          <h1 className="text-gray-800 dark:text-gray-200 font-medium">
            Dashboard
          </h1>
        </Link>

        <Link
          href="/coursetable"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          <SquareLibrary
            size={24}
            className="text-gray-800 dark:text-gray-200"
          />
          <h1 className="text-gray-800 dark:text-gray-200 font-medium">
            Courses
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

