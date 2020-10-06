import { Form } from "react-bootstrap";
import axios from "../helpers/axios";
import { categoryConstansts } from "./constants";

export const getAllCategory = () => {
  return async (dispatch) => {
    dispatch({ type: categoryConstansts.GET_ALL_CATEGORIES_REQUEST });

    try {
      const res = await axios.get(`/category/getcategory`);
      console.log(res);
      if (res.status === 200) {
        const { categoryList } = res.data;

        dispatch({
          type: categoryConstansts.GET_ALL_CATEGORIES_SUCCESS,
          payload: { categories: categoryList },
        });
      } else {
        dispatch({
          type: categoryConstansts.GET_ALL_CATEGORIES_FAILURE,
          payload: { error: res.data.error },
        });
      }
    } catch (error) {
      console.log(error.response);
    }
  };
};

export const addCategory = (form) => {
  return async (dispatch) => {
    dispatch({ type: categoryConstansts.ADD_NEW_CATEGORY_REQUEST });
    const res = await axios.post(`/category/create`, form);
    if (res.status === 201) {
      dispatch({
        type: categoryConstansts.ADD_NEW_CATEGORY_SUCCESS,
        payload: { category: res.data.category },
      });
    } else {
      dispatch({
        type: categoryConstansts.ADD_NEW_CATEGORY_FAILURE,
        payload: res.data.error,
      });
    }
  };
};

export const delCategory = (id) => {
  console.log(id);
  const cat = JSON.stringify({ _id: id });
  return async (dispatch) => {
    dispatch({ type: categoryConstansts.DEL_CATEGORY_REQUEST });
    const res = await axios.delete(`/category/delete/${id}`);
    if (res.status === 201) {
      // dispatch({
      //     type: categoryConstansts.DEL_CATEGORY_SUCCESS,
      //     payload: id
      // });
      console.log(res);
      return true;
    } else {
      // dispatch({
      //     type: categoryConstansts.DEL_CATEGORY_FAILURE,
      //     payload: res.data.error
      // });
      console.log(res);
    }
  };
};

export const updateCategory = (form) => {
  return async (dispatch) => {
    const res = await axios.put(`/category/update`, form);
    if (res.status === 201) {
      console.log(res);
      return true;
    } else {
      console.log(res);
    }
  };
};
