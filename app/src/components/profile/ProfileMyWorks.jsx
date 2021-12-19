/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageList from '@mui/material/ImageList';
import {
  Grid,
  Paper,
  Hidden,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Loader from '../Loader';
import Message from '../Message';
import { fetchArtistWorks, updateUserStore } from '../../actions/userAction';
import MyArtCard from './MyArtCard';
import { DEPLOY_MY_STORE_RESET } from '../../constants/lazyFactoryConstants';
import { fetchMarketPlace } from '../../actions/marketPlaceAction';
import { deployMyStore } from '../../actions/lazyFactoryAction';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
    paddingTop: 0,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

function ProfileMyWorks() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [galleryName, setGalleryName] = useState('');
  const [signerContractAddress, setSignerContractAddress] = useState('');

  const myWorks = useSelector((state) => state.myWorks);
  const {
    error: errorMyWorks,
    loading: loadingMyWorks,
    success: successMyWork,
  } = myWorks;

  const theMarketPlace = useSelector((state) => state.theMarketPlace);
  const { marketPlace } = theMarketPlace;

  const myStore = useSelector((state) => state.myStore);
  const {
    BLOCKCHAIN,
    loading: loadingMyStore,
    success: successMyStore,
    error: errorMyStore,
  } = myStore;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  // loading button
  useEffect(() => {
    if (loadingMyStore) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingMyStore]);

  // disable button when form is not filled
  useEffect(() => {
    if (!galleryName) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [galleryName]);

  useEffect(() => {
    dispatch(fetchMarketPlace());
    dispatch(fetchArtistWorks());
  }, [dispatch]);

  // contract address and factory
  useEffect(() => {
    if (user && user.store_address) {
      setSignerContractAddress(user.store_address);
    } else if (successMyStore) {
      setSignerContractAddress(BLOCKCHAIN.signerContract.address);
    }
  }, [successMyStore, user]);

  // update user store contract if not available
  useEffect(() => {
    if (user && !user.store_address && signerContractAddress) {
      dispatch(updateUserStore(signerContractAddress));
    }
  }, [signerContractAddress]);

  // my Store deployment
  const handleStoreDeployment = () => {
    dispatch(deployMyStore(marketPlace.contract, galleryName));
  };

  const classes = useStyles();

  return (
    <div style={{ minHeight: '100vh' }}>
      {!successMyWork || !myWorks || !myWorks.works || loadingMyWorks ? (
        <Loader />
      ) : errorMyWorks ? (
        <Message variant="outlined" severity="info">
          {errorMyWorks}
        </Message>
      ) : (
        <div>
          {user && !user.store_address ? (
            <Grid item sx={{ margin: 10, textAlign: 'center' }}>
              <TextField
                color="secondary"
                value={galleryName}
                type="text"
                onChange={(e) => setGalleryName(e.target.value)}
                label="Permanent Gallery Name"
                sx={{ margin: 'auto' }}
                size="small"
              />
              <LoadingButton
                variant="contained"
                color="primary"
                disabled={isDisabled}
                loading={isLoading}
                onClick={handleStoreDeployment}
                sx={{ margin: 'auto', padding: 1 }}
              >
                Create My Gallery
              </LoadingButton>
            </Grid>
          ) : (
            <>
              <Grid container direction="row" spacing={0}>
                <Typography variant="subtitle2">
                  Gallery Address:
                  <Link
                    href={`https://rinkeby.etherscan.io/address/${signerContractAddress}`}
                    target="blank"
                  >
                    {signerContractAddress}
                  </Link>
                </Typography>
                <Grid item xs={9} className={classes.root}>
                  <ImageList
                    // variant="masonry"
                    cols={3}
                    gap={30}
                    sx={{ paddingRight: 5 }}
                  >
                    {myWorks.works.my_artworks.map((artwork) => (
                      <MyArtCard key={artwork._id} artwork={artwork} />
                    ))}
                  </ImageList>
                </Grid>
              </Grid>
              <Grid>
                <Hidden mdUp>
                  <Grid container>
                    <Paper className={classes.responsive} elevation={0}>
                      {myWorks.works.my_artworks.map((artwork) => (
                        <Grid key={artwork._id}>
                          <Paper className={classes.paper}>
                            <MyArtCard key={artwork._id} artwork={artwork} />
                          </Paper>
                        </Grid>
                      ))}
                    </Paper>
                  </Grid>
                </Hidden>
              </Grid>
            </>
          )}
        </div>
      )}
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        {errorMyStore && (
          <Message backError={errorMyStore} variant="filled" severity="error" />
        )}
      </Grid>
    </div>
  );
}

export default ProfileMyWorks;
