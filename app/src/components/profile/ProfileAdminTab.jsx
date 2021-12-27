import React, { useState, useEffect } from 'react';
import { Paper, Grid, TextField, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  fetchMarketBalance,
  fetchMarketPlace,
} from '../../actions/marketPlaceAction';

const ProfileAdminTab = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const theMarketPlace = useSelector((state) => state.theMarketPlace);
  const { marketPlace, loading: loadingMarketPlace } = theMarketPlace;

  const marketPlaceBalance = useSelector((state) => state.marketPlaceBalance);
  const { marketBalance, loading: loadingMarketBalance } = marketPlaceBalance;

  useEffect(() => {
    dispatch(fetchMarketPlace());
  }, [dispatch]);

  // loading button
  useEffect(() => {
    if (loadingMarketPlace || loadingMarketBalance) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingMarketPlace, loadingMarketBalance]);

  return (
    <Grid item sx={{ margin: 10, textAlign: 'center' }}>
      {!marketPlace || !marketPlace.contract ? (
        <Grid sx={{ margin: 'auto', textAlign: 'center' }}>
          <CircularProgress color="secondary" />
        </Grid>
      ) : (
        <Grid>
          <LoadingButton
            variant="contained"
            color="primary"
            disabled={isDisabled}
            loading={isLoading}
            onClick={() => dispatch(fetchMarketBalance(marketPlace.contract))}
            sx={{ margin: 'auto', padding: 1 }}
          >
            {marketPlaceBalance && marketPlaceBalance.marketBalance
              ? marketPlaceBalance.marketBalance
              : 'MarketPlace Balance'}
          </LoadingButton>
        </Grid>
      )}
    </Grid>
  );
};

export default ProfileAdminTab;
