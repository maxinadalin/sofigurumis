import { SearchIcon } from "@heroicons/react/solid";

const SearchBox = ({ categories, search, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="text-base font-medium text-gray-500 hover:text-gray-900"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="search"
        name="search"
        onChange={(e) => onChange(e)}
        value={search}
        required
        className="block w-full font-gilroy-medium dark:text-dark-txt bg-search dark:bg-dark-bg border-1.5 dark:border-dark-bg border-gray-500 rounded-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        placeholder="Search"
        type="search"
      />
    </form>
  );
};

export default SearchBox;
