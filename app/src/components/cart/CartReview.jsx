/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Grid, Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { fetchUserDetails } from '../../actions/userAction';
import Message from '../Message';
import Loader from '../Loader';
import { connectWallet } from '../../actions/blockChainAction';

function CartReview({ setTabValue, formValues }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const userDetails = useSelector((state) => state.userDetails);
  const {
    error: errorUserDetails,
    loading: loadingUserDetails,
    success: successUserDetails,
  } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!successUserDetails) {
      dispatch(fetchUserDetails());
    }
  }, [userInfo, history, successUserDetails]);

  // edit
  const onEdit = () => {
    setTabValue('1');
  };

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
            <Button
              variant="custom"
              color="primary"
              sx={{ width: '100%' }}
              onClick={() => dispatch(connectWallet())}
            >
              Connect Wallet
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {errorUserDetails && (
        <Message severity="errorUserDetails">{errorUserDetails}</Message>
      )}
      {loadingUserDetails && <Loader />}
    </div>
  );
}

export default CartReview;
