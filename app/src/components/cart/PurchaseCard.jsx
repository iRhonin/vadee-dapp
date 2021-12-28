/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useParams } from 'react-router';
import { fetchEthPrice, fetchMarketFee } from '../../actions/marketPlaceAction';
import { fetchOneArtWork } from '../../actions/artworkAction';
import { dollarToEth, weiToEth } from '../../converter';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    marginTop: window.innerWidth > 900 ? 130 : 20,
    marginBottom: 50,
  },
  media: {
    minHeight: 100,
  },
}));

export default function PurchaseCard() {
  const { workId } = useParams();
  const dispatch = useDispatch();

  const [shippingPrice, setShippingPrice] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [serviceFee, setServiceFee] = useState();
  const [shippingEth, setShippingEth] = useState();
  const [priceEth, setPriceEth] = useState();
  const [totalPriceEth, setTotalPriceEth] = useState();

  const theCart = useSelector((state) => state.theCart);
  const { cartItems } = theCart;

  const marketFee = useSelector((state) => state.marketFee);
  const { fee, success: successMarketFee } = marketFee;

  const ethPrice = useSelector((state) => state.ethPrice);
  const { result, success: successEthPrice } = ethPrice;

  const theArtwork = useSelector((state) => state.theArtwork);
  const { artwork } = theArtwork;

  // total in dollar
  useEffect(() => {
    if (successMarketFee && cartItems[0]) {
      setServiceFee(fee);
      setShippingPrice(0);
      setTotalPrice(cartItems[0].price + shippingPrice);
    }
  }, [cartItems, shippingPrice, serviceFee, successMarketFee, fee]);

  useEffect(() => {
    if (cartItems && cartItems[0] && workId) {
      dispatch(fetchMarketFee(cartItems[0].price));
      dispatch(fetchOneArtWork(workId));
      dispatch(fetchEthPrice());
    }
  }, [cartItems, dispatch, workId]);

  // convert price
  useEffect(() => {
    if (artwork && artwork.voucher && artwork.voucher.artwork_id) {
      const convertedPrice = weiToEth(artwork.voucher.price_wei);
      setPriceEth(convertedPrice);
    }
  }, [artwork]);

  // shipping
  useEffect(() => {
    if (!shippingEth) {
      setShippingPrice(100);
    }
  }, [shippingEth]);

  // convert shipping
  useEffect(() => {
    if (shippingPrice && !shippingEth && successEthPrice) {
      console.log('shippingPrice');
      const convertedPrice = dollarToEth(shippingPrice, result.ethereum.usd);
      setShippingEth(convertedPrice);
    }
  }, [shippingPrice, shippingEth, successEthPrice, result]);

  // convert price
  useEffect(() => {
    if (priceEth && shippingEth && successEthPrice) {
      console.log('now');
      setTotalPriceEth(parseFloat(priceEth) + parseFloat(shippingEth));
    }
  }, [priceEth, shippingEth, successEthPrice]);

  const classes = useStyles();
  return (
    <>
      {!cartItems[0] ||
      !artwork.voucher ||
      !successMarketFee ||
      !successEthPrice ? null : (
        <Paper className={classes.root} elevation={0} variant="outlined" square>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            sx={{
              padding: 3,
              ':hover': {
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <Grid item xs={5}>
              <Grid item>
                <img
                  src={`${cartItems[0].image}`}
                  alt="Art work"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Grid>
            </Grid>
            <Grid item xs={7} sx={{ padding: 1 }}>
              <Grid item>
                <Typography variant="h6">
                  {cartItems[0].firstName} {cartItems[0].lastName}
                </Typography>
                <Typography variant="subtitle1">
                  {cartItems[0].title}
                </Typography>
              </Grid>
              <Grid
                container
                direction="column"
                alignItems="flex-end"
                sx={{
                  borderTop: '1px solid #e0e0e0',
                  marginTop: 5,
                }}
              >
                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs>
                    <Typography variant="body1">Price</Typography>
                  </Grid>
                  <Grid item md={8}>
                    <Typography variant="body2">
                      {artwork.voucher.artwork_id && `Ξ  ${priceEth}`}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs>
                    <Typography variant="body1">Shipping</Typography>
                  </Grid>
                  <Grid item md={8}>
                    <Typography variant="body2">
                      {artwork.voucher.artwork_id && `Ξ  ${shippingEth}`}
                    </Typography>
                  </Grid>
                </Grid>
                {/* <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">Service fee</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2">
                      {artwork.voucher.artwork_id && `Ξ  ${feeEth}`}
                    </Typography>
                  </Grid>
                </Grid> */}
                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs>
                    <Typography variant="body1">Total</Typography>
                  </Grid>
                  <Grid item md={8}>
                    <Typography variant="body2">
                      {totalPriceEth && `Ξ  ${totalPriceEth.toFixed(4)}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
}
