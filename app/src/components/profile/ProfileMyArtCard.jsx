/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import { Grid, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { signMyItem } from '../../actions/lazyFactoryAction';
import {
  deleteVoucher,
  fetchOneArtWork,
  updateArtwork,
} from '../../actions/artworkAction';
import { SIGN_MY_ITEM_RESET } from '../../constants/lazyFactoryConstants';
import { ARTWORK_UPDATE_RESET } from '../../constants/artworkConstants';
import { dollarToEth, weiToEth } from '../../converter';

export default function ProfileMyArtCard({ artwork }) {
  const dispatch = useDispatch();

  const [artistGalleryAddress, setArtistGalleryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [priceEth, setPriceEth] = useState();

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const myVoucher = useSelector((state) => state.myVoucher);
  const {
    voucher,
    signerAddress,
    loading: loadingSignature,
    success: successSignature,
  } = myVoucher;

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

  useEffect(() => {
    if (user && user.artist.gallery_address) {
      setArtistGalleryAddress(user.artist.gallery_address);
    }
  }, [user, artwork, successUpdateArtwork, dispatch]);

  useEffect(() => {
    if (
      successSignature &&
      !successUpdateArtwork &&
      voucher.artworkId === artwork._id
    ) {
      // add signature backend - galleryAddress = false / walletAddress = false
      dispatch(
        updateArtwork(artwork, false, signerAddress, false, voucher, 'Signing')
      );
    } else if (
      successUpdateArtwork &&
      voucher &&
      voucher.artworkId === artwork._id
    ) {
      dispatch({ type: SIGN_MY_ITEM_RESET });
      dispatch(fetchOneArtWork(artwork._id));
    }
  }, [successUpdateArtwork, signerAddress, successSignature, artwork]);

  // convert price to ETH
  useEffect(() => {
    if (artwork && artwork.voucher && artwork.voucher.artwork_id) {
      const convertedPrice = weiToEth(artwork.voucher.price_wei);
      setPriceEth(convertedPrice);
    }
  }, [artwork]);

  // handle signature
  const handleSignature = async () => {
    dispatch({ type: ARTWORK_UPDATE_RESET });
    dispatch({ type: SIGN_MY_ITEM_RESET });

    const convertedPrice = await dollarToEth(
      artwork.price,
      result.ethereum.usd
    );
    if (artistGalleryAddress) {
      dispatch(
        signMyItem(
          artistGalleryAddress,
          artwork,
          convertedPrice,
          artwork.price,
          user.firstName,
          user.lastName
        )
      );
    }
  };

  return (
    <Paper
      sx={{ border: '1px solid black', position: 'relative' }}
      elevation={5}
    >
      <Grid
        sx={{
          opacity: 0.8,
          ':hover': {
            opacity: 1,
          },
        }}
      >
        {artwork && (
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
              sx={{
                width: '100%',
                margin: 'auto',
                marginBottom: 5,
                textAlign: 'center',
              }}
            >
              {artwork.voucher.artwork_id
                ? ` Ξ  ${priceEth}`
                : `$ ${artwork.price.toLocaleString()}`}
            </Typography>
          </ImageListItem>
        )}
      </Grid>
      <LoadingButton
        disabled={isDisabled}
        loading={isLoading}
        size="small"
        onClick={
          !artwork.voucher.signature
            ? () => handleSignature()
            : () => dispatch(deleteVoucher(artwork.voucher._id))
        }
        sx={{ position: 'absolute', bottom: 0, width: '100%' }}
        variant={!artwork.voucher.signature ? 'contained' : 'outlined'}
      >
        {!artwork.voucher.signature ? (
          'Sign to Sell'
        ) : (
          <HighlightOffIcon color="error" />
        )}
      </LoadingButton>
    </Paper>
  );
}

ProfileMyArtCard.propTypes = {
  artwork: PropTypes.object,
};
