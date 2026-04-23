import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center mt-8 gap-2 justify-center sm:justify-end">
            {links.map((link, index) => {
                const label = link.label
                    .replace("&laquo; Previous", "←")
                    .replace("Next &raquo;", "→");

                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-100 rounded-xl bg-slate-50/50"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 active:scale-95 ${
                            link.active
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
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
