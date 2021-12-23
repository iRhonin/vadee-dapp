/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import { Grid, Typography, Paper } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import { favArtwork } from '../../actions/userAction';
import { signMyItem } from '../../actions/lazyFactoryAction';
import { fetchOneArtWork, updateArtwork } from '../../actions/artworkAction';
import { SIGN_MY_ITEM_RESET } from '../../constants/lazyFactoryConstants';
import { ARTWORK_UPDATE_RESET } from '../../constants/artworkConstants';

export default function MyArtCard({ artworkId }) {
  const dispatch = useDispatch();

  const [signerContractAddress, setSignerContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const myVoucher = useSelector((state) => state.myVoucher);
  const {
    voucher,
    signerAddress,
    loading: loadingSignature,
    success: successSignature,
  } = myVoucher;

  const theArtwork = useSelector((state) => state.theArtwork);
  const { artwork, success: successArtwork } = theArtwork;

  const artworkUpdate = useSelector((state) => state.artworkUpdate);
  const { success: successUpdateArtwork } = artworkUpdate;

  const ethPrice = useSelector((state) => state.ethPrice);
  const { result, success: successEthPrice } = ethPrice;

  // loading button
  useEffect(() => {
    if (loadingSignature) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingSignature]);

  // disable button before fetching ETH price
  useEffect(() => {
    if (successEthPrice) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [successEthPrice]);

  // contract address and factory
  useEffect(() => {
    if (user && user.store_address) {
      dispatch({ type: ARTWORK_UPDATE_RESET });
      setSignerContractAddress(user.store_address);
    }
  }, [user]);

  // fetch artwork if not success
  useEffect(() => {
    dispatch(fetchOneArtWork(artworkId));
  }, [dispatch, artworkId]);

  useEffect(() => {
    if (successSignature && !successUpdateArtwork) {
      // add signature backend - storeAddress = false / walletAddress = false
      dispatch(
        updateArtwork(artwork, false, signerAddress, false, voucher, 'Signing')
      );
    } else if (successUpdateArtwork) {
      dispatch(fetchOneArtWork(artworkId));
      dispatch({ type: SIGN_MY_ITEM_RESET });
    }
  }, [successUpdateArtwork, signerAddress, successSignature, artwork]);

  // handle signature
  const handleSignature = async () => {
    const artworkPriceEth = artwork.price / result.ethereum.usd;
    if (signerContractAddress) {
      dispatch(
        signMyItem(
          signerContractAddress,
          artwork,
          artworkPriceEth,
          user.firstName,
          'tokenUri'
        )
      );
    }
  };

  return (
    <Paper sx={{ border: '1px solid black' }} elevation={5}>
      <Grid
        sx={{
          // marginBottom: 5,
          opacity: 0.8,
          ':hover': {
            opacity: 1,
          },
        }}
      >
        {successArtwork && (
          <ImageListItem style={{ color: '#666666' }}>
            <Link
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              to={`/artworks/${artwork._id}`}
            />

            <img
              srcSet={`${artwork.image}?w=161&fit=crop&auto=format 1x,
                    ${artwork.image}?w=161&fit=crop&auto=format&dpr=2 2x`}
              alt={artwork.title}
              loading="lazy"
            />
            <Typography
              variant="subtitle2"
              sx={{ width: '100%', margin: 'auto', textAlign: 'center' }}
            >
              {artwork.title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ width: '100%', margin: 'auto', textAlign: 'center' }}
            >
              ${artwork.price.toLocaleString()}
            </Typography>
            <ImageListItemBar
              style={{ background: 'transparent', textAlign: 'center' }}
              position="below"
              actionIcon={
                <LoadingButton
                  disabled={isDisabled}
                  loading={isLoading}
                  size="small"
                  onClick={() => handleSignature()}
                  variant={
                    !artwork.voucher.signature ? 'contained' : 'outlined'
                  }
                  sx={{ width: '100%' }}
                >
                  {!artwork.voucher.signature
                    ? 'Sign to Sell'
                    : 'Remove Signature'}
                </LoadingButton>
              }
            />
          </ImageListItem>
        )}
      </Grid>
    </Paper>
  );
}

MyArtCard.propTypes = {
  artworkId: PropTypes.number,
};
