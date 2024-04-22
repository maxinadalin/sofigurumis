import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  get_product,
  get_related_products,
} from "../../redux/actions/products";
import ImageGalery from "../products/ImageGalery";
 import {
   get_items,
   add_item,
   get_total,
   get_item_total,
 } from "../../redux/actions/cart";
 import {  add_wishlist_item, 
  get_wishlist_items, 
  get_wishlist_item_total,
  remove_wishlist_item,} from "../../redux/actions/wishlist"
import { get_reviews,
  get_review,
  create_review,
  update_review,
  delete_review,
  filter_reviews} from "../../redux/actions/reviews"
import { Oval } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import WishlistHeart from "./wishlistHeart";
import Stars from "./stars";
import { StarIcon } from "@heroicons/react/solid";


const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Product_Detail({
  get_product,
  get_related_products,
  product,
  add_item,
  isAuthenticated,
  add_wishlist_item, 
  get_wishlist_items, 
  get_wishlist_item_total,
  remove_wishlist_item,
  get_reviews,
  get_review,
  create_review,
  update_review,
  delete_review,
  filter_reviews,
wishlist,
review,
reviews,
}) {
  const params = useParams();
  const id = params.productId;

  useEffect(() => {
    window.scrollTo(0,0)
      get_product(id)
      get_related_products(id)
      get_wishlist_items()
      get_wishlist_item_total()
  }, [])

  useEffect(() => {
      get_reviews(id);
  }, [id]);

  useEffect(() => {
      get_review(id);
  }, [id]);

  const [formData, setFormData] = useState({
    comment:'',
    rating:'',
  })

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const addToCart = async () => {
    if (
      product &&
      product !== null &&
      product !== undefined &&
      product.quantity > 0
    ) {
       setLoading(true);
       await add_item(product);
       setLoading(false);
       navigate("/categories");
       console.log(product.id)
    }
  };

  if  (!isAuthenticated)
  return(<Navigate to={"/Login"}/>)

  const addToWishlist = async () => {
    if (isAuthenticated) {
      let isPresent = false;
      if(
        wishlist &&
        wishlist !== null &&
        wishlist !== undefined &&
        product &&
        product !== null &&
        product !== undefined
        ){
          wishlist.map(item => {
              if (item.product.id.toString() === product.id.toString()) {
                  isPresent = true;
              }
          });
      }
      
      if (isPresent) {
        await remove_wishlist_item(product.id);
        await get_wishlist_items();
        await get_wishlist_item_total();
      } else {
        await remove_wishlist_item(product.id);
          await add_wishlist_item(product.id);
          await get_wishlist_items();
          await get_wishlist_item_total();
          await get_items();
          await get_total();
          await get_item_total();
      }
        
    } else {
      return <Navigate to="/cart"/>
    }
  };

  // const [rating, setRating] = useState(5.0);

 

  const { comment,rating } = formData

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const leaveReview = e => {
    e.preventDefault()
    if (rating !== null)
      create_review(id, rating, comment);
  }
  
  const updateReview = e => {
    e.preventDefault()
    if (rating !== null)
      update_review(id, rating, comment);
  }

  const deleteReview = () => {
    const fetchData = async () => {
        await delete_review(id);
        await get_review(id);
        // setRating(5.0);
        setFormData({
            comment: ''
        });
    };
    fetchData();
  };

  const filterReviews = numStars => {
      filter_reviews(id, numStars);
  };

  const getReviews = () => {
      get_reviews(id);
  };

  return (
    <div className="bg-white">
      <div className="bg-white">
        <div className="pt-6">
          <ImageGalery photo={product && product.photo} />
          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product &&
                  product !== null &&
                  product !== undefined &&
                  product.name}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {product &&
                  product !== null &&
                  product !== undefined &&
                  product.price}
              </p>

              <div className="mt-10">
                {loading ? (
                  <button className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Oval type="Oval" color="#fff" width={20} height={20} />
                  </button>
                ) : (
                  <button
                    onClick={addToCart}
                    className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                  >
                    Agregar al Carrito
                  </button>
                )}
                  <WishlistHeart
                product={product}
                wishlist={wishlist}
                addToWishlist={addToWishlist}
                />
              </div>
            </div>

            <section className='my-5 max-w-7xl'>
            <div className="grid grid-cols-5">
                  <div className="col-span-2">
                    {/* <div>
                      
                      <button
                          className='btn btn-primary btn-sm mb-3 ml-6 mt-2 font-sofiapro-light'
                          onClick={getReviews}
                      >
                          Mostrar todas
                      </button>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(5)}
                        >
                            <Stars rating={5.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(4.0)}
                        >
                            <Stars rating={4.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(3.0)}
                        >
                            <Stars rating={3.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(2.0)}
                        >
                            <Stars rating={2.0} />
                        </div>
                        <div
                            className='mb-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => filterReviews(1.0)}
                        >
                            <Stars rating={1.0} />
                        </div>
                    </div> */}
                    {
                      review && isAuthenticated ? 
                      <form onSubmit={e => updateReview(e)}>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                          Add your review
                        </label>
                        <div className="mt-1">
                          <textarea
                            rows={4}
                            name="comment"
                            id="comment"
                            required
                            value={comment}
                            onChange={e=>onChange(e)}
                            placeholder={review.comment}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                      <select
                          name="rating"
                          className="mt-4 float-right"
                          required
                          value={rating}
                          onChange={e=>onChange(e)}
                          placeholder="0 - 5">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                      </select>
                      <button
                        type="submit"
                        className="mt-4  inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update
                      </button>
                      </form>:

                      <form onSubmit={e => leaveReview(e)}>
                      
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                          Add your review
                        </label>
                        <div className="mt-1">
                          <textarea
                            rows={4}
                            name="comment"
                            id="comment"
                            required
                            value={comment}
                            onChange={e=>onChange(e)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            defaultValue={''}
                          />
                        </div>
                      </div>


                      {/* <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{
                reviews.average
                } out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div> */}







                      <select
                          name="rating"
                          className="mt-4 float-right"
                          required
                          value={rating}
                          onChange={e=>onChange(e)}
                          placeholder="0 - 5">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                      </select>
                      <button
                        type="submit"
                        className="mt-4  inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add
                      </button>
                      </form>
                    }
                  </div>
                  <div className="col-span-3">
                    {reviews && reviews.map((review,index)=>(
                      <>
                      <div className="flex">
                        <div className="mx-4 flex-shrink-0">
                        <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        </div>
                        <div>
                          <Stars rating={review.rating}/>
                          <h4 className="text-lg font-bold">{review.user}</h4>
                          <p className="mt-1">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                      </>
                    ))}
                  </div>

            </div>
          </section>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {product &&
                      product !== null &&
                      product !== undefined &&
                      product.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3>
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">
                    {product &&
                      product !== null &&
                      product !== undefined &&
                      product.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  product: state.Products.product,
  wishlist: state.Wishlist.wishlist,
  review: state.Reviews.review,
  reviews: state.Reviews.reviews,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {
   get_product,
   get_related_products,
   get_items,
   add_item,
   get_total,
   get_item_total,
   add_wishlist_item, 
   get_wishlist_items, 
   get_wishlist_item_total,
   remove_wishlist_item,
   get_reviews,
   get_review,
   create_review,
   update_review,
   delete_review,
   filter_reviews
})(Product_Detail);
