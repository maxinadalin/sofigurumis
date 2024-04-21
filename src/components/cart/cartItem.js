import { connect } from "react-redux";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import { Fragment, useState,useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  ChartBarIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Popover } from "@headlessui/react";
import { Oval } from "react-loader-spinner";
import {
  get_items,
  get_total,
  get_item_total,
  remove_item,
  update_item,
} from "../../redux/actions/cart";
import { useNavigate } from "react-router-dom";


const solutions = [
  {
    name: "Analytics",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: ChartBarIcon,
  },
  {
    name: "Analytics",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: ChartBarIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CartItem({
  itemarray,
  count,
  update_item,
  remove_item,
  render,
  setRender,
  total_items,
  product,
  amount,
  get_items,
  get_total,
  get_item_total,
}) {
  useEffect(() => {
    get_items();
    get_total();
    get_item_total();
  }, []);


  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRemoveItem = (productId) => {
    // Llama a la función remove_item pasando el ID del producto
    remove_item(productId);
  };

 

  const addToCart2 = async () => {
    navigate("/cart");
    // if (
    //   itemarray &&
    //   itemarray !== null &&
    //   itemarray !== undefined &&
    //   itemarray.quantity > 0
    // ) {
    //   setLoading(true);
    //   await add_item(itemarray);
    //   await get_items();
    //   await get_total();
    //   await get_item_total();
    //   setLoading(false);

    // }
  };

  return (
    <Popover className=" ">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              "group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none",
              open
                ? "text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                : "text-gray-500"
            )}
          >
            <a href="#">
              <ShoppingCartIcon
                className={classNames(
                  open ? "text-gray-900" : "text-gray-400",
                  "m-2 h-5 w-5  group-hover:text-gray-500 "
                )}
                aria-hidden="true"
              />
            </a>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 top-full right-1 transform shadow-lg bg-white w-1/3 h-auto">
              <div className="max-w-7xl mx-auto grid gap-y-6 px-4 py-6 sm:grid-cols-1 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-1 lg:px-8 lg:py-12 xl:py-16">
                <div className="flex md:h-full lg:flex-col">
                  <div>
                    <h3>Tienes {total_items} productos en tu carrito</h3>
                  </div>
                  {itemarray != null &&
                    itemarray != undefined &&
                    itemarray &&
                    itemarray.map((items, index) => (
                      <div key={index}>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                            <img
                              src={items.product.photo}
                              alt={items.product.name}
                            />
                          </span>
                          
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          {items.product.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {items.product.description}
                        </p>
                        <div>
                          <p className="mt-1 text-sm text-gray-500">
                            {items.count} unidad
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {items.product.price}
                          </p>
                        </div>
                        <div>
                            <button onClick={() => handleRemoveItem(items)}>
                              <XIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                      </div>
                    ))}

                  <div className="ml-4 md:flex-1 md:flex md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                    <div>
                      <div>TOTAL: {amount}</div>
                    </div>
                    {loading ? (
                      <button className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Oval type="Oval" color="#fff" width={20} height={20} />
                      </button>
                    ) : (
                      <button
                        onClick={addToCart2}
                        className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                      >
                        Finalizar Compra
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
const mapStateToProps = (state) => ({
  total_items: state.Cart.total_items,
  product: state.Products.products,
  amount: state.Cart.amount,
  itemarray: state.Cart.items,
});
export default connect(mapStateToProps, {
  remove_item,
  update_item,
  get_items,
  get_total,
  get_item_total,
})(CartItem);
