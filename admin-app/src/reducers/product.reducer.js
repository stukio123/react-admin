import { productConstants } from "../actions/constants";

const initialState = {
  products: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case productConstants.GET_ALL_PRODUCTS_SUCCESS:
      state = {
        ...state,
        products: action.payload.products,
        loading: false,
      };
      break;
    case productConstants.ADD_PRODUCT_REQUEST:
      state = {
          ...state,
          loading:true
      };
      break;
    case productConstants.ADD_PRODUCT_SUCCESS:
      state = {
        ...state,
        products: [...state.products, action.payload.product],
        loading: false
      };
      break;
  }

  return state;
};
