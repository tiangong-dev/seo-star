import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import React from "react"

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  clearSearch: () => void
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  clearSearch
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 px-6 py-2 border-b border-border">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search SEO data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-8 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
