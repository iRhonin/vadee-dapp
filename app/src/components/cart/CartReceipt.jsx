/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Grid, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { fetchUserDetails } from '../../actions/userAction';
import Message from '../Message';
import Loader from '../Loader';
import { fetchOneArtWork } from '../../actions/artworkAction';

function CartReceipt() {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const {
    error: errorUserDetails,
    loading: loadingUserDetails,
    success: successUserDetails,
  } = userDetails;

  const theArtwork = useSelector((state) => state.theArtwork);
  const { success: successArtwork, artwork } = theArtwork;

  const walletConnection = useSelector((state) => state.walletConnection);
  const {
    wallet,
    success: successWallet,
    error: errorWallet,
  } = walletConnection;

  const redeemAndMint = useSelector((state) => state.redeemAndMint);
  const { error: errorRedeemAndMint, success: successRedeemAndMint } =
    redeemAndMint;

  const artworkUpdate = useSelector((state) => state.artworkUpdate);
  const { success: successUpdateArtwork } = artworkUpdate;

  const theCart = useSelector((state) => state.theCart);
  const { cartItems } = theCart;

  useEffect(() => {
    if (!successUserDetails) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, successUserDetails, successRedeemAndMint]);

  // fetch artwork if not success
  useEffect(() => {
    if (cartItems[0] && cartItems[0].artworkId) {
      dispatch(fetchOneArtWork(cartItems[0].artworkId));
    }
  }, [cartItems, successRedeemAndMint]);

  useEffect(() => {
    if (successUpdateArtwork && successRedeemAndMint) {
      dispatch(fetchOneArtWork(artwork._id));
    }
  }, [successUpdateArtwork, successRedeemAndMint, artwork]);

  return (
    <div>
      <Paper sx={{ padding: 2 }} elevation={0}>
        <Grid container direction="row" alignItems="flex-start" spacing={2}>
          <Grid item xs={12} sx={{ width: '100%', marginTop: 0 }}>
            <Button
              variant="contained"
              sx={{ width: '100%', marginTop: 2, marginBottom: 4 }}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {(errorUserDetails || errorWallet || errorRedeemAndMint) && (
        <Message severity="error">
          {errorUserDetails || errorWallet || errorRedeemAndMint}
        </Message>
      )}
      {loadingUserDetails && <Loader />}
    </div>
  );
}

export default CartReceipt;
