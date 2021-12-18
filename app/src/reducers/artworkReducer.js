import {
  ARTWORK_DETAILS_FAIL,
  ARTWORK_DETAILS_SUCCESS,
  ARTWORK_DETAILS_REQUEST,
  ARTWORK_DETAILS_RESET,
  ARTWORK_CREATE_FAIL,
  ARTWORK_CREATE_SUCCESS,
  ARTWORK_CREATE_REQUEST,
  ARTWORK_CREATE_RESET,
  ARTWORK_UPDATE_REQUEST,
  ARTWORK_UPDATE_SUCCESS,
  ARTWORK_UPDATE_FAIL,
  ARTWORK_UPDATE_RESET,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
} from '../constants/artworkConstants';

export const artworkReducer = (state = { artwork: {} }, action) => {
  switch (action.type) {
    case ARTWORK_DETAILS_REQUEST:
      return { loading: true, ...state };
    case ARTWORK_DETAILS_SUCCESS:
      return { loading: false, artwork: action.payload };
    case ARTWORK_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case ARTWORK_DETAILS_RESET:
      return { artwork: {} };
    default:
      return state;
  }
};

// admin panel edit artwork
export const artworkUpdateReducer = (state = { artwork: {} }, action) => {
  switch (action.type) {
    case ARTWORK_UPDATE_REQUEST:
      return { loading: true };
    case ARTWORK_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case ARTWORK_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case ARTWORK_UPDATE_RESET:
      return { artwork: {} };
    default:
      return state;
  }
};

export const artworkCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ARTWORK_CREATE_REQUEST:
      return { loading: true };
    case ARTWORK_CREATE_SUCCESS:
      return { loading: false, success: true, createdArtwork: action.payload };
    case ARTWORK_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ARTWORK_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const categoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { loading: true };
    case CATEGORY_LIST_SUCCESS:
      return { loading: false, success: true, categories: action.payload };
    case CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
