import axios from "../helpers/axios";
import { productConstants } from "./constants";

export const addProduct = (form) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.ADD_PRODUCT_REQUEST });
    const res = await axios.post(`/products/create`, form, {
      headers: { "content-type": "application/json" },
    });
    if (res.status === 200)
      dispatch({
        type: productConstants.ADD_PRODUCT_SUCCESS,
        payload: { product: res.data.product },
      });
    else
      dispatch({
        type: productConstants.ADD_PRODUCT_FAILURE,
        payload: res.data.error,
      });
  };
};
