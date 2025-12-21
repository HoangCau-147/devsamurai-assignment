import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const title = "Search Input";

const SearchInput = () => (
  <div className="w-full max-w-sm space-y-2">
    <div className="relative">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 z-1 text-gray-500" />
      <Input
        className="bg-background pl-9 border-none"
        id="search-input"
        placeholder="Search..."
        type="search"
      />
    </div>
  </div>
);

export default SearchInput;
