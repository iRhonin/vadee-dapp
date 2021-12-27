import { combineReducers } from '@reduxjs/toolkit';
import {
  artworksReducer,
  artworkDeleteReducer,
  artworkReducer,
  artworkUpdateReducer,
  artworkCreateReducer,
  categoriesReducer,
  artworkVoucherDeleteReducer,
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
import {
  artistByIdReducer,
  artistGalleryReducer,
  artistListReducer,
} from './artistReducer.js';
import { articleListReducer } from './articleReducer.js';
import { filterReducer } from './filterReducer.js';
import {
  mintAndRedeemReducer,
  galleryDeployReducer,
  voucherReducer,
  walletConnectionReducer,
} from './lazyFactoryReducer.js';
import {
  ethPriceReducer,
  MarketBalanceReducer,
  marketPlaceDeployReducer,
  marketPlaceFeeReducer,
  marketPlaceReducer,
} from './marketPlaceReducer.js';

export default combineReducers({
  headerStatus: headerReducer,
  artworks: artworksReducer,
  theArtwork: artworkReducer,
  artworkDeleteList: artworkDeleteReducer,
  voucherDelete: artworkVoucherDeleteReducer,
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
  marketFee: marketPlaceFeeReducer,
  theMarketPlace: marketPlaceReducer,
  marketPlaceBalance: MarketBalanceReducer,
  deployGallery: galleryDeployReducer,
  backEndGallery: artistGalleryReducer,
  buyAndMint: mintAndRedeemReducer,
  ethPrice: ethPriceReducer,
});
