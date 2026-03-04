"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}: PaginationProps) {
    if (totalPages <= 1) return null

    const pages: (number | string)[] = []
    const range = 1 // Number of pages to show before and after current page

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - range && i <= currentPage + range)
        ) {
            pages.push(i)
        } else if (
            i === currentPage - range - 1 ||
            i === currentPage + range + 1
        ) {
            pages.push("...")
        }
    }

    // Remove consecutive ellipses
    const uniquePages = pages.filter((item, index) => {
        return item !== "..." || pages[index - 1] !== "..."
    })

    return (
        <div className={`flex items-center justify-center gap-2 py-6 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-gray-100 hover:border-orange-200 hover:text-[#ee4d2d] disabled:opacity-40"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5">
                {uniquePages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span className="w-9 text-center text-gray-300">
                                <MoreHorizontal className="h-4 w-4 mx-auto" />
                            </span>
                        ) : (
                            <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className={`h-9 w-9 rounded-xl text-xs font-black transition-all ${currentPage === page
                                    ? "bg-[#ee4d2d] hover:bg-[#d73211] shadow-lg shadow-red-100 border-none"
                                    : "border-gray-100 text-gray-400 hover:border-orange-200 hover:text-[#ee4d2d]"
                                    }`}
                                onClick={() => onPageChange(page as number)}
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-gray-100 hover:border-orange-200 hover:text-[#ee4d2d] disabled:opacity-40"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
