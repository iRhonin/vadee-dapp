// import axios from 'axios';
// import artworksBase from '../apis/artworksBase';
// import {
//   ARTWORK_LIST_REQUEST,
//   ARTWORK_LIST_SUCCESS,
//   ARTWORK_LIST_FAIL,
//   ARTWORK_DETAILS_REQUEST,
//   ARTWORK_DETAILS_SUCCESS,
//   ARTWORK_DETAILS_FAIL,
//   ARTWORK_CREATE_FAIL,
//   ARTWORK_CREATE_SUCCESS,
//   ARTWORK_CREATE_REQUEST,
//   ARTWORK_DELETE_REQUEST,
//   ARTWORK_DELETE_SUCCESS,
//   ARTWORK_DELETE_FAIL,
//   ARTWORK_UPDATE_REQUEST,
//   ARTWORK_UPDATE_SUCCESS,
//   ARTWORK_UPDATE_FAIL,
// } from '../constants/artworkConstants';

// import {
//   CART_ADD_REQUEST,
//   CART_ADD_SUCCESS,
//   CART_SAVE_SHIPPING_ADDRESS,
//   CART_REMOVE_ITEMS,
//   CHANGE_CART_STEP,
//   CART_SAVE_PAYMENT_METHOD,
// } from '../constants/cartConstants';
// import {
//   USER_LOGIN_REQUEST,
//   USER_LOGIN_SUCCESS,
//   USER_LOGIN_FAIL,
//   USER_LOGOUT,
//   USER_REGISTER_REQUEST,
//   USER_REGISTER_SUCCESS,
//   USER_REGISTER_FAIL,
//   USER_DETAILS_SUCCESS,
//   USER_DETAILS_FAIL,
//   USER_DETAILS_REQUEST,
//   USER_DETAILS_RESET,
//   USER_UPDATE_PROFILE_REQUEST,
//   USER_UPDATE_PROFILE_SUCCESS,
//   USER_UPDATE_PROFILE_FAIL,
//   USER_UPDATE_REQUEST,
//   USER_UPDATE_SUCCESS,
//   USER_UPDATE_FAIL,
//   USER_LIST_REQUEST,
//   USER_LIST_SUCCESS,
//   USER_LIST_FAIL,
//   USER_LIST_RESET,
//   USER_DELETE_REQUEST,
//   USER_DELETE_SUCCESS,
//   USER_DELETE_FAIL,
// } from '../constants/userConstants';
// import {
//   ARTIST_LIST_REQUEST,
//   ARTIST_LIST_SUCCESS,
//   ARTIST_LIST_FAIL,
//   ARTIST_DETAILS_REQUEST,
//   ARTIST_DETAILS_SUCCESS,
//   ARTIST_DETAILS_FAIL,
// } from '../constants/artistConstants';
// import {
//   ORDER_CREATE_REQUEST,
//   ORDER_CREATE_SUCCESS,
//   ORDER_CREATE_FAIL,
//   MY_ORDERS_REQUEST,
//   MY_ORDERS_SUCCESS,
//   MY_ORDERS_FAIL,
//   MY_ORDERS_REMOVE_ALL,
//   ORDER_LIST_REQUEST,
//   ORDER_LIST_SUCCESS,
//   ORDER_LIST_FAIL,
//   ORDER_DETAILS_REQUEST,
//   ORDER_DETAILS_SUCCESS,
//   ORDER_DETAILS_FAIL,
//   ORDER_PAY_REQUEST,
//   ORDER_PAY_SUCCESS,
//   ORDER_PAY_FAIL,
//   ORDER_DELIVER_REQUEST,
//   ORDER_DELIVER_SUCCESS,
//   ORDER_DELIVER_FAIL,
// } from '../constants/orderConstants';

// export const headerStatus = (status) => async (dispatch) => {
//   dispatch({ type: 'HEADER_HIDDEN', payload: status });
// };

// export const fetchAllArtWorks =
//   (keyword = '') =>
//   async (dispatch) => {
//     try {
//       const response = await artworksBase.get(`artworks${keyword}/`);
//       dispatch({ type: ARTWORK_LIST_REQUEST });
//       dispatch({
//         type: ARTWORK_LIST_SUCCESS,
//         payload: response.data,
//       });
//     } catch (e) {
//       // check for generic and custom message to return using ternary statement
//       dispatch({
//         type: ARTWORK_LIST_FAIL,
//         payload:
//           e.response && e.response.data.detail
//             ? e.response.data.details
//             : e.message,
//       });
//     }
//   };

// export const fetchOneArtWork = (workId) => async (dispatch) => {
//   try {
//     const response = await artworksBase.get(`artworks/${workId}/`);
//     await dispatch({ type: ARTWORK_DETAILS_REQUEST });
//     dispatch({
//       type: ARTWORK_DETAILS_SUCCESS,
//       payload: response.data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: ARTWORK_DETAILS_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const addToCart = (workId) => async (dispatch, getState) => {
//   const { data } = await artworksBase.get(`artworks/${workId}/`);
//   dispatch({ type: CART_ADD_REQUEST });
//   dispatch({
//     type: CART_ADD_SUCCESS,
//     payload: {
//       artworkId: data._id,
//       title: data.title,
//       image: data.image,
//       price: data.price,
//       quantity: data.quantity,
//       editionNum: data.editionNum,
//       editionSize: data.editionSize,
//     },
//   });
//   // save the item in browser local storage. It needs to be parsed back to an object to be used
//   localStorage.setItem(
//     'cartItems',
//     JSON.stringify(getState().theCart.cartItems)
//   );
// };

// export const cleanLocalCart = () => async (dispatch) => {
//   localStorage.removeItem('cartItems');
//   localStorage.removeItem('shippingAddress');
//   localStorage.removeItem('paymentMethod');
//   localStorage.removeItem('__paypal_storage__'); // created when checking out by PayPal
//   dispatch({
//     type: CART_REMOVE_ITEMS,
//   });
// };

// export const cleanMyOrders = () => async (dispatch) => {
//   localStorage.removeItem('myOrders');
//   dispatch({
//     type: MY_ORDERS_REMOVE_ALL,
//   });
// };

// export const login = (email, password) => async (dispatch) => {
//   try {
//     dispatch({ type: USER_LOGIN_REQUEST });
//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//       },
//     };
//     const { data } = await axios.post('users/login/', {
//       username: email,
//       password,
//       config,
//     });
//     dispatch({
//       type: USER_LOGIN_SUCCESS,
//       payload: data,
//     });
//     localStorage.setItem('userInfo', JSON.stringify(data));
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: USER_LOGIN_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const logout = () => (dispatch) => {
//   localStorage.removeItem('userInfo');
//   localStorage.removeItem('cartItems');
//   localStorage.removeItem('shippingAddress');
//   dispatch({ type: USER_LOGOUT });
//   dispatch({ type: USER_DETAILS_RESET });
//   dispatch({ type: USER_LIST_RESET });
//   cleanMyOrders();
// };

// export const register =
//   (firstName, lastName, email, password) => async (dispatch) => {
//     try {
//       dispatch({ type: USER_REGISTER_REQUEST });
//       const config = {
//         headers: {
//           'Content-type': 'application/json',
//         },
//       };
//       const { data } = await axios.post('users/register/', {
//         firstName,
//         lastName,
//         email,
//         username: email,
//         password,
//         config,
//       });
//       dispatch({
//         type: USER_REGISTER_SUCCESS,
//         payload: data,
//       });
//       localStorage.setItem('userInfo', JSON.stringify(data));

//       dispatch({
//         type: USER_LOGIN_SUCCESS,
//         payload: data,
//       });
//     } catch (e) {
//       // check for generic and custom message to return using ternary statement
//       dispatch({
//         type: USER_REGISTER_FAIL,
//         payload:
//           e.response && e.response.data.detail
//             ? e.response.data.details
//             : e.message,
//       });
//     }
//   };

// export const fetchArtistDetails = (id) => async (dispatch) => {
//   try {
//     dispatch({ type: ARTIST_DETAILS_REQUEST });

//     const { data } = await axios.get(`artists/${id}/`);
//     dispatch({
//       type: ARTIST_DETAILS_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: ARTIST_DETAILS_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const saveShippingAddress = (data) => async (dispatch) => {
//   dispatch({
//     type: CART_SAVE_SHIPPING_ADDRESS,
//     payload: data,
//   });
//   localStorage.setItem('shippingAddress', JSON.stringify(data));
// };

// export const cartStep = (step) => async (dispatch) => {
//   dispatch({
//     type: CHANGE_CART_STEP,
//     payload: step,
//   });
// };

// export const savePaymentMethod = (data) => async (dispatch) => {
//   dispatch({
//     type: CART_SAVE_PAYMENT_METHOD,
//     payload: data,
//   });
//   localStorage.setItem('paymentMethod', JSON.stringify(data));
// };

// export const createOrder = (order) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_CREATE_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.post(`orders/add/`, order, config);

//     dispatch({
//       type: ORDER_CREATE_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: ORDER_CREATE_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const fetchOrderDetails = (id) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_DETAILS_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };
//     const { data } = await axios.get(`orders/${id}/`, config);

//     dispatch({
//       type: ORDER_DETAILS_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: ORDER_DETAILS_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const fetchUserOrderList = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: MY_ORDERS_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };
//     const { data } = await axios.get(`orders/myOrders/`, config);

//     dispatch({
//       type: MY_ORDERS_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: MY_ORDERS_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_PAY_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };
//     const { data } = await axios.put(
//       `orders/${id}/pay/`,
//       paymentResult,
//       config
//     );

//     dispatch({
//       type: ORDER_PAY_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: ORDER_PAY_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const fetchUsers = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: USER_LIST_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.get(`users/`, config);
//     dispatch({
//       type: USER_LIST_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: USER_LIST_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const deleteUser = (selectedUsers) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: USER_DELETE_REQUEST });

//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const { data } = await axios.delete(`users/delete/`, {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//       data: {
//         selectedUsers,
//       },
//     });

//     dispatch({
//       type: USER_DELETE_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: USER_DELETE_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const deleteArtwork =
//   (selectedArtworks) => async (dispatch, getState) => {
//     try {
//       dispatch({ type: ARTWORK_DELETE_REQUEST });

//       const {
//         userLogin: { userInfo },
//       } = getState();

//       const { data } = await axios.delete(`artworks/delete/`, {
//         headers: {
//           'Content-type': 'application/json',
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//         data: {
//           selectedArtworks,
//         },
//       });

//       dispatch({
//         type: ARTWORK_DELETE_SUCCESS,
//         payload: data,
//       });
//     } catch (e) {
//       // check for generic and custom message to return using ternary statement
//       dispatch({
//         type: ARTWORK_DELETE_FAIL,
//         payload:
//           e.response && e.response.data.detail
//             ? e.response.data.details
//             : e.message,
//       });
//     }
//   };

// export const updateUser = (user) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: USER_UPDATE_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.put(`users/update/${user._id}/`, user, config);

//     dispatch({
//       type: USER_UPDATE_SUCCESS,
//     });

//     dispatch({
//       type: USER_DETAILS_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: USER_UPDATE_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const updateArtwork = (artwork) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ARTWORK_UPDATE_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.put(
//       `artworks/update/${artwork._id}/`,
//       artwork,
//       config
//     );

//     dispatch({
//       type: ARTWORK_UPDATE_SUCCESS,
//     });

//     dispatch({
//       type: ARTWORK_DETAILS_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: ARTWORK_UPDATE_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const fetchArtistList = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ARTIST_LIST_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.get(`artists/`, config);
//     dispatch({
//       type: ARTIST_LIST_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     // check for generic and custom message to return using ternary statement
//     dispatch({
//       type: ARTIST_LIST_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const createArtwork = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ARTWORK_CREATE_REQUEST });

//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.post(`artworks/create/`, {}, config);
//     dispatch({
//       type: ARTWORK_CREATE_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: ARTWORK_CREATE_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const fetchOrders = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_LIST_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };
//     const { data } = await axios.get(`orders/`, config);

//     dispatch({
//       type: ORDER_LIST_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: ORDER_LIST_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };

// export const deliverOrder = (orderId) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_DELIVER_REQUEST });
//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };
//     const { data } = await axios.put(`orders/${orderId}/deliver/`, config);

//     dispatch({
//       type: ORDER_DELIVER_SUCCESS,
//       payload: data,
//     });
//   } catch (e) {
//     dispatch({
//       type: ORDER_DELIVER_FAIL,
//       payload:
//         e.response && e.response.data.detail
//           ? e.response.data.details
//           : e.message,
//     });
//   }
// };
