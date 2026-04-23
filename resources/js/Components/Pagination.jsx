import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap -mb-1 mt-6 justify-center">
            {links.map((link, index) => {
                const label = link.label
                    .replace("&laquo; Previous", "«")
                    .replace("Next &raquo;", "»");

                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-blue-500 focus:text-blue-500 ${
                            link.active
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-white text-gray-800"
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: label }}
                        preserveState
                        preserveScroll
                    />
                );
            })}
        </div>
    );
}
