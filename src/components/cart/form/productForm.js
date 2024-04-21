import {
    XIcon,
  } from "@heroicons/react/solid";
const ProductForm = ({
    remove,
    onChange,
    product
}) => {
    return(

    <form //onSubmit={(product) => onSubmit(product)}
    >
      <select
        name="item_count"
        onChange={(e) => onChange(e)}
        // value={item_count}
        className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
      </select>
      <button
        type="submit"
        className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
      >
        <span className="mx-2">Update</span>
      </button>
      <div className="absolute top-0 right-0">
        <button
          onClick={() => remove(product)}
          type="button"
          className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Eliminar</span>
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
    )
}


export default ProductForm
