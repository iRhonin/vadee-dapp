/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageList from '@mui/material/ImageList';
import { Grid, Paper, Hidden, Typography, Link } from '@mui/material';
import Loader from '../Loader';
import Message from '../Message';
import { fetchArtistWorks } from '../../actions/userAction';
import ProfileMyArtCard from './ProfileMyArtCard';
import {
  fetchEthPrice,
  fetchMarketPlace,
} from '../../actions/marketPlaceAction';

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

function ProfileMyOnSale() {
  const dispatch = useDispatch();

  const [artistGalleryAddress, setArtistGalleryAddress] = useState('');

  const myWorks = useSelector((state) => state.myWorks);
  const {
    error: errorMyWorks,
    loading: loadingMyWorks,
    success: successMyWork,
  } = myWorks;

  const voucherDelete = useSelector((state) => state.voucherDelete);
  const { success: successDeleteVoucher } = voucherDelete;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const deployGallery = useSelector((state) => state.deployGallery);
  const { success: successDeployGallery } = deployGallery;

  useEffect(() => {
    dispatch(fetchMarketPlace());
    dispatch(fetchArtistWorks());
    dispatch(fetchEthPrice());
  }, [dispatch, successDeleteVoucher]);

  // contract address and factory
  useEffect(() => {
    if (user && user.artist.gallery_address) {
      setArtistGalleryAddress(user.artist.gallery_address);
    }
  }, [user, successDeployGallery]);

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
          {user && !user.artist.gallery_address ? (
            <Grid item sx={{ margin: 10, textAlign: 'center' }}>
              <Typography sx={{ margin: 2 }}>
                Hey, {user.artist.firstName} create your gallery to get started!
              </Typography>
            </Grid>
          ) : (
            <>
              <Grid container direction="row" spacing={0}>
                <Typography variant="subtitle2">
                  Gallery Address:
                  <Link
                    href={`https://rinkeby.etherscan.io/address/${artistGalleryAddress}`}
                    target="blank"
                  >
                    {artistGalleryAddress}
                  </Link>
                </Typography>
                <Grid item xs={9} className={classes.root}>
                  <ImageList
                    // variant="masonry"
                    cols={3}
                    gap={30}
                    sx={{ paddingRight: 5 }}
                  >
                    {myWorks.works.my_artworks.map(
                      (artwork) =>
                        artwork.on_market && (
                          <ProfileMyArtCard
                            key={artwork._id}
                            artwork={artwork}
                          />
                        )
                    )}
                  </ImageList>
                </Grid>
              </Grid>
              <Grid>
                <Hidden mdUp>
                  <Grid container>
                    <Paper className={classes.responsive} elevation={0}>
                      {myWorks.works.my_artworks.map((artwork) => (
                        <Grid key={artwork._id}>
                          {artwork.on_market && (
                            <Paper className={classes.paper}>
                              <ProfileMyArtCard
                                key={artwork._id}
                                artwork={artwork}
                              />
                            </Paper>
                          )}
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
    </div>
  );
}

export default ProfileMyOnSale;
