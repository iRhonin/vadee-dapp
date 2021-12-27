/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Grid, Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { fetchUserDetails } from '../../actions/userAction';
import Message from '../Message';
import Loader from '../Loader';
import { connectWallet, mintAndRedeem } from '../../actions/lazyFactoryAction';
import { fetchOneArtWork } from '../../actions/artworkAction';
import { fetchEthPrice } from '../../actions/marketPlaceAction';

function CartReview({ setTabValue, formValues }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isDisabled, setIsDisabled] = useState(false);

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

  const buyAndMint = useSelector((state) => state.buyAndMint);
  const {
    purchased,
    error: errorMintAndBuy,
    loading: loadingMintAndBuy,
  } = buyAndMint;

  const theCart = useSelector((state) => state.theCart);
  const { cartItems } = theCart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!successUserDetails) {
      dispatch(fetchUserDetails());
    }
  }, [userInfo, history, successUserDetails]);

  // fetch artwork if not success
  useEffect(() => {
    if (!successArtwork && cartItems[0] && cartItems[0].artworkId) {
      dispatch(fetchOneArtWork(cartItems[0].artworkId));
    }
  }, [dispatch, cartItems, successArtwork]);

  useEffect(() => {
    dispatch(fetchEthPrice());
    dispatch(connectWallet());
    window.ethereum.on('accountsChanged', function (accounts) {
      dispatch(connectWallet());
    });
  }, [dispatch]);

  // edit
  const onEdit = () => {
    setTabValue('1');
  };

  const userAccountStart = wallet ? wallet.slice(0, 6) : null;
  const userAccountEnd = wallet ? wallet.slice(-5) : null;

  return (
    <div>
      <Paper sx={{ padding: 2 }} elevation={0}>
        <Grid container direction="row" alignItems="flex-start" spacing={2}>
          <Grid item xs={12} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              Full Name:
            </Typography>
            <Typography component="span">{formValues.firstName}</Typography>
            <Typography component="span">{formValues.lastName}</Typography>
          </Grid>
          <Grid item xs={4} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              Country:
            </Typography>
            <Typography component="span">{formValues.country}</Typography>
          </Grid>

          <Grid item xs={4} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              Province:
            </Typography>
            <Typography component="span">{formValues.province}</Typography>
          </Grid>
          <Grid item xs={4} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              City:
            </Typography>
            <Typography component="span">{formValues.city}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              Address:
            </Typography>
            <Typography component="span">{formValues.address}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              Postal Code:
            </Typography>
            <Typography component="span">{formValues.postalCode}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="span">
              Phone:
            </Typography>
            <Typography component="span">{formValues.phoneNumber}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '100%', marginTop: 0 }}>
            <Button
              variant="contained"
              sx={{ width: '100%', marginTop: 2, marginBottom: 4 }}
              onClick={onEdit}
            >
              Edit
            </Button>
            {successWallet ? (
              <LoadingButton
                variant="custom"
                disabled={isDisabled}
                loading={loadingMintAndBuy}
                color="primary"
                sx={{ width: '100%' }}
                onClick={
                  !successWallet
                    ? () => dispatch(connectWallet())
                    : () =>
                        dispatch(
                          mintAndRedeem(
                            artwork._id,
                            artwork.artist.gallery_address,
                            artwork.voucher,
                            artwork.price
                          )
                        )
                }
              >
                Purchase by
                <Typography
                  sx={{ fontWeight: 'bolder', paddingRight: 1, paddingLeft: 1 }}
                  variant="body2"
                >
                  {userAccountStart}...{userAccountEnd}
                </Typography>
              </LoadingButton>
            ) : (
              <Button
                variant="custom"
                color="primary"
                sx={{ width: '100%' }}
                onClick={() => dispatch(connectWallet())}
              >
                Connect Wallet
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      {(errorUserDetails || errorWallet || errorMintAndBuy) && (
        <Message severity="error">
          {errorUserDetails || errorWallet || errorMintAndBuy}
        </Message>
      )}
      {loadingUserDetails && <Loader />}
    </div>
  );
}

export default CartReview;
