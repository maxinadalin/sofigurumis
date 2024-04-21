import { combineReducers } from "redux";
import auth from "./auth";
import Alert from "./alert";
import Categories from "./categories";
import Products from "./products";
import Cart from "./cart";
import Payment from "./payment";


export default combineReducers({
 auth,
 Alert,
 Categories,
 Products,
 Cart,   
 Payment,
    
})