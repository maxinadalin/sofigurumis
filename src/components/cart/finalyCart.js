import { connect } from "react-redux";
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { remove_item, update_item } from "../../redux/actions/cart";
import { setAlert } from "../../redux/actions/alert";
import { useEffect, useState } from "react";
import {
  get_payment_total,
  get_client_token,
  process_payment,
} from "../../redux/actions/payment";
import DropIn from "braintree-web-drop-in-react";
import { countries } from "../../helpers/fixedCountries";
import {Oval} from "react-loader-spinner";
import ShippingForm from "./form/shippingForm";
import { refresh } from "../../redux/actions/auth";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ProductForm from "./form/productForm";

const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    price: "$32.00",
    color: "Sienna",
    inStock: true,
    size: "Large",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    price: "$32.00",
    color: "Black",
    inStock: false,
    leadTime: "3–4 weeks",
    size: "Large",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35.00",
    color: "White",
    inStock: true,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
];
function FinalyCart({
  isAuthenticated, 
  items,
  update_item,
  remove_item,
  setAlert,
  refresh,
  get_payment_total,
  get_client_token,
  process_payment,
  user,
  total_items,
  clientToken,
  made_payment,
  loading,
  original_price,
  total_after_coupon,
  total_amount,
  total_compare_amount,
  estimated_tax,

}) {

  
  useEffect(() => {
    get_client_token();
    get_payment_total();
  }, [user]);

  useEffect(() => {
    window.scrollTo(0,0)
  }, []);

  const [formData, setFormData] = useState({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province_region: '',
    postal_zip_code: '',
    country_region: 'españa',
    telephone_number: '',
  });

  const [data, setData] = useState({
    instance: {},
  });

  const {
    full_name,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        telephone_number,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });



    const buy = async e => {
      let nonce = await data.instance.requestPaymentMethod(); // Aquí solicitas el nonce de pago
      process_payment(
        nonce,
        full_name,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        telephone_number
    );
  }



  const renderPaymentInfo = () => {
    if (!clientToken) {
      if (!isAuthenticated) {
        return (
          <Link
            to="/login"
            className="w-full bg-gray-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
          >
            Login
          </Link>
        );
      } else {
        return (
          <button
            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            <Oval
              type="Oval"
              color="#fff"
              width={20}
              height={20}
            />
          </button>
        );
      }
    } else {
      return (
        <>
          <DropIn
            options={{
                authorization: clientToken,
                paypal: {
                    flow: 'vault'
                }
            }}
            onInstance={instance =>
              console.log('Braintree instance:', instance) // Esta es la línea que puedes agregar
               (data.instance = instance)}
            onPaymentMethodRequestable={(event) => {
                console.log('Payment method requestable event:', event)}}
          />
          <div className="mt-6">
            {loading ? (
              <button
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              >
                <Oval
                  type="Oval"
                  color="#fff"
                  width={20}
                  height={20}
                />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500"
              >
                Place Order
              </button>
            )}
          </div>
        </>
      );
    }
  }
  




  let count = items && items.count;

  // useEffect(() => {
  //   items &&
  //   items.map((product) => (
  //     console.log(product.product)
  //   ))
  //   products &&
  //   products.map((item) => (
  //     console.log(item.quantity)
  //   ))

  // }, []);

  const remove = (product_id) => {
    remove_item(product_id);
  };

  const [render, setRender] = useState(false);

  // if(!isAuthenticated)
  //     return <Navigate to='/' />;

  // if (count) setFormData({ ...formData, item_count: count });

  // const [formData, setFormData] = useState({
  //   item_count: 1,
  // });

  // const { item_count } = formData;

  // const onChange = (e) =>
  //   setFormData({ ...formData, [e.target.name]: e.target.value });

  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   const fetchData = async () => {
  //     try {
  //       if (products.product.quantity >= item_count) {
  //         await update_item(e, item_count);
  //       } else {
  //         setAlert("Not enough in stock", "danger");
  //       }
  //       setRender(!render);
  //     } catch (err) {}
  //   };

  //   fetchData();
  // };

  if (made_payment)
  return <Navigate to='/TanksYou' />;

  return (
    <>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            CARRITO DE COMPRAS
          </h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="border-t border-b border-gray-200 divide-y divide-gray-200"
              >
                {items &&
                  items.map((product, productIdx) => (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <img
                          src={product.product.photo}
                          className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <label>{product.product.name}</label>
                              </h3>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.product.price}
                            </p>
                          </div>
                      <ProductForm
                      onChange={onchange}
                      remove={remove}
                      product={product}
                      />
                          
            {/* Order summary */}

            
                        </div>

                        <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                          {product.product.quantity > product.product.sold ? (
                            <CheckIcon
                              className="flex-shrink-0 h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <XIcon
                              className="flex-shrink-0 h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          )}

                          <span>
                            {product.product.quantity > product.product.sold ? (
                              <div className="text-green-500"> In stock </div>
                            ) : (
                              <div className=" text-red-500">out of stock</div>
                            )}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>

            {/* Order summary */}
            <ShippingForm
           full_name={full_name}
           address_line_1={address_line_1}
           address_line_2={address_line_2}
           city={city}
           state_province_region={state_province_region}
           postal_zip_code={postal_zip_code}
           telephone_number={telephone_number}
           countries={countries}
           onChange={onChange}
           buy={buy}
           user={user}
           total_amount={total_amount}
           total_compare_amount={total_compare_amount}
           estimated_tax={estimated_tax}
           renderPaymentInfo={renderPaymentInfo} 
            />

          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  items: state.Cart.items,
  amount: state.Cart.amount,
  total_items: state.Cart.total_items,
  products: state.Products.products,
  clientToken: state.Payment.clientToken,
  made_payment: state.Payment.made_payment,
  loading: state.Payment.loading,
  original_price: state.Payment.original_price,
  total_after_coupon: state.Payment.total_after_coupon,
  total_amount: state.Payment.total_amount,
  total_compare_amount: state.Payment.total_compare_amount,
  estimated_tax: state.Payment.estimated_tax,
  shipping_cost: state.Payment.shipping_cost,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  remove_item,
  get_client_token,
  get_payment_total,
  update_item,
  setAlert,
  // get_shipping_options,
  refresh,
  process_payment,
  // check_coupon,
})(FinalyCart);
