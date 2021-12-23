import { combineReducers } from '@reduxjs/toolkit';
import { artworksReducer, artworkDeleteReducer } from './artworksReducer.js';
import {
  artworkReducer,
  artworkUpdateReducer,
  artworkCreateReducer,
  categoriesReducer,
} from './artworkReducer.js';
import cartReducer from './cartReducer.js';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  usersReducer,
  userDeleteReducer,
  userUpdateReducer,
  favArtworkReducer,
  favArtworkListReducer,
  artistArtworksReducer,
} from './userReducer';
import {
  orderCreateReducer,
  userOrderListReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListReducer,
  orderDeliverReducer,
} from './orderReducer';
import headerReducer from './headerReducer';
import { artistByIdReducer, artistListReducer } from './artistReducer.js';
import { articleListReducer } from './articleReducer.js';
import { filterReducer } from './filterReducer.js';
import {
  mintAndRedeemReducer,
  storeDeployReducer,
  voucherReducer,
  walletConnectionReducer,
} from './lazyFactoryReducer.js';
import {
  ethPriceReducer,
  MarketBalanceReducer,
  marketPlaceDeployReducer,
  marketPlaceReducer,
} from './marketPlaceReducer.js';

export default combineReducers({
  headerStatus: headerReducer,
  artworks: artworksReducer,
  theArtwork: artworkReducer,
  artworkDeleteList: artworkDeleteReducer,
  theCart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  artistList: artistListReducer,
  theArtist: artistByIdReducer,
  artworkUpdate: artworkUpdateReducer,
  userUpdateProfile: userUpdateProfileReducer,
  favArtwork: favArtworkReducer,
  favArtworkList: favArtworkListReducer,
  // userList: usersReducer,
  userDeleteList: userDeleteReducer,
  artworkCreate: artworkCreateReducer,
  userUpdate: userUpdateReducer, // update user from admin
  myWorks: artistArtworksReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  ordersList: orderListReducer,
  myOrders: userOrderListReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  articlesList: articleListReducer,
  filterOrigin: filterReducer,
  categoryList: categoriesReducer,
  walletConnection: walletConnectionReducer,
  myVoucher: voucherReducer,
  marketPlaceDeployment: marketPlaceDeployReducer,
  theMarketPlace: marketPlaceReducer,
  marketPlaceBalance: MarketBalanceReducer,
  myStore: storeDeployReducer,
  buyAndMint: mintAndRedeemReducer,
  ethPrice: ethPriceReducer,
});
