/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useParams } from 'react-router';
import { fetchOneArtWork, addToCart, headerStatus } from '../../actions/index';

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

  const [shippingPrice, setShippingPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(10);
  const theArtwork = useSelector((state) => state.theArtwork);
  const { artwork } = theArtwork;

  const theCart = useSelector((state) => state.theCart);
  const { cartItems } = theCart;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { orderById } = orderDetails;

  useEffect(() => {
    if (cartItems[0]) {
      setShippingPrice(0);
      setTotalPrice(cartItems[0].price + shippingPrice);
    }
  }, [cartItems, shippingPrice]);

  const classes = useStyles();
  return (
    <>
      {!cartItems[0] ? null : (
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
                  <Grid item xs={6}>
                    <Typography variant="body1">Price</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2">
                      {cartItems[0].price.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">Shipping</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2">
                      {shippingPrice.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">Service fee</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2">
                      {serviceFee.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">Total</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2">
                      {totalPrice.toLocaleString()}
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
