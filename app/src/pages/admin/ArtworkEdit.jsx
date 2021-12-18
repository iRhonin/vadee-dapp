/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { TextField, Checkboxes } from 'mui-rff';
import { Typography, Grid, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  headerStatus,
  fetchUsers,
  updateArtwork,
  fetchArtistList,
  fetchArtistDetails,
  fetchOneArtWork,
} from '../../actions/index.js';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    margin: 'auto',
    maxWidth: 400,
    [theme.breakpoints.down('sm')]: {
      marginTop: 100,
    },
  },
}));

export default function ArtworkEdit() {
  const history = useHistory();
  const [created_by, setAccountOwner] = useState('');
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [medium, setMedium] = useState('');
  const [condition, setCondition] = useState('');
  const [classifications, setClassifications] = useState('');
  const [image, setImage] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [unit, setUnit] = useState('');
  const [isAnEdition, setIsAnEdition] = useState(false);
  const [editionNum, setEditionNum] = useState('');
  const [editionSize, setEditionSize] = useState('');
  const [is_signed, setIsSigned] = useState('');
  const [is_authenticated, setIsAuthenticated] = useState('');
  const [frame, setFrame] = useState('');
  const [isPrice, setIsPrice] = useState(false);
  const [price, setPrice] = useState('');
  const [about_work, setabout_work] = useState('');
  const [provenance, setProvenance] = useState('');
  const [art_location, setart_location] = useState('');
  const [quantity, setQuantity] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const { artworkId } = useParams();

  const userList = useSelector((state) => state.userList);
  const { users, loading: loadingUsers } = userList;

  const theArtwork = useSelector((state) => state.theArtwork);
  const { error, loading, artwork } = theArtwork;

  const artistList = useSelector((state) => state.artistList);
  const { artists, loading: loadingArtistList } = artistList;

  const artistDetails = useSelector((state) => state.artistDetails);
  const { theArtist, loading: loadingTheArtist } = artistDetails;

  const artworkUpdate = useSelector((state) => state.artworkUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = artworkUpdate;

  useEffect(() => {
    if (successUpdate) {
      history.push('/admin-panel/artworks');
    } else if (!artwork.title || artwork._id !== Number(artworkId)) {
      dispatch(fetchOneArtWork(artworkId));
      dispatch(fetchUsers());
      dispatch(fetchArtistList());
    } else {
      dispatch(fetchArtistDetails(artwork.artist));
      setAccountOwner(artwork.created_by);
      setArtist(artwork.artist);
      setTitle(artwork.title);
      setSubtitle(artwork.subtitle);
      setYear(artwork.year);
      setCategory(artwork.category);
      setMedium(artwork.medium);
      setCondition(artwork.condition);
      setClassifications(artwork.classifications);
      setImage(artwork.image);
      setWidth(artwork.width);
      setHeight(artwork.height);
      setDepth(artwork.depth);
      setUnit(artwork.unit);
      setIsAnEdition(artwork.isAnEdition);
      setEditionNum(artwork.editionNum);
      setEditionSize(artwork.editionSize);
      setIsSigned(artwork.is_signed);
      setIsAuthenticated(artwork.is_authenticated);
      setIsPrice(artwork.isPrice);
      setFrame(artwork.frame);
      setPrice(artwork.price);
      setabout_work(artwork.about_work);
      setProvenance(artwork.provenance);
      setart_location(artwork.art_location);
      setQuantity(artwork.quantity);
    }
  }, [artwork, dispatch, successUpdate, history, artworkId]);

  useEffect(() => {
    dispatch(headerStatus(false));
    return function cleanup() {
      dispatch(headerStatus(true));
    };
  }, [dispatch]);

  const onSubmit = async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updateArtwork({
        _id: artwork._id,
        created_by,
        artist,
        title,
        subtitle,
        year,
        category,
        medium,
        condition,
        classifications,
        image,
        width,
        height,
        depth,
        unit,
        isAnEdition,
        editionNum,
        editionSize,
        is_signed,
        is_authenticated,
        frame,
        isPrice,
        price,
        about_work,
        provenance,
        art_location,
        quantity,
      })
    );
  };

  const validate = () => {
    const errors = {};
    if (!title) {
      errors.title = 'لطفا عنوان را وارد کنید';
    }
    if (!width) {
      errors.width = 'لطفا وارد کنید';
    }
    if (!height) {
      errors.height = 'لطفا وارد کنید';
    }
    if (!depth) {
      errors.depth = 'لطفا وارد کنید';
    }

    return errors;
  };
  const formFields = [
    {
      size: 12,
      field: (
        <TextField
          variant="outlined"
          type="text"
          label="عکس "
          name="category"
          value={image || ''}
          margin="normal"
          disabled
        />
      ),
    },
    {
      size: 6,
      field: (
        <FormControl variant="outlined" style={{ minWidth: '100%' }} required>
          {artwork && artwork._id && users && (
            <>
              <InputLabel
                htmlFor="uncontrolled-native"
                style={{ paddingRight: 5 }}
              >
                {' '}
                صاحب اکانت
              </InputLabel>
              <Select
                defaultValue={artwork.created_by}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={(e) => setAccountOwner(e.target.value)}
                label="صاحب اکانت"
              >
                {users[0]
                  ? users.map((user, idx) =>
                      user.isAdmin ? (
                        <MenuItem value={user.id} key={idx}>
                          {user.id} - {user.firstName}
                        </MenuItem>
                      ) : (
                        <MenuItem value={user.id} key={idx} disabled>
                          {user.id} - {user.firstName}
                        </MenuItem>
                      )
                    )
                  : null}
              </Select>
            </>
          )}
        </FormControl>
      ),
    },
    {
      size: 6,
      field: (
        <FormControl variant="outlined" style={{ minWidth: '100%' }} required>
          {artwork && theArtist && artists && (
            <>
              <InputLabel
                htmlFor="uncontrolled-native"
                style={{ paddingRight: 5 }}
              >
                {' '}
                هنرمند
              </InputLabel>
              <Select
                defaultValue={theArtist._id}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={(e) => setArtist(e.target.value)}
                label="هنرمند"
              >
                {artists[0]
                  ? artists.map((item, idx) =>
                      item ? (
                        <MenuItem value={item._id} key={idx}>
                          {item._id} - {item.firstName}
                        </MenuItem>
                      ) : (
                        <MenuItem value={item.id} key={idx} disabled>
                          {item._id} - {item.firstName}
                        </MenuItem>
                      )
                    )
                  : null}
              </Select>
            </>
          )}
        </FormControl>
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="عنوان"
          name="title"
          value={title || ''}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="ساب عنوان"
          name="subtitle"
          value={subtitle || ''}
          onChange={(e) => setSubtitle(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="سال"
          name="year"
          value={year || ''}
          onChange={(e) => setYear(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="دسته‌بندی"
          name="category"
          value={category || ''}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="مدیوم"
          name="medium"
          value={medium || ''}
          onChange={(e) => setMedium(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="وضعیت"
          name="condition"
          value={condition || ''}
          onChange={(e) => setCondition(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 12,
      field: (
        <FormControl
          variant="outlined"
          margin="normal"
          style={{ minWidth: '100%' }}
          required
        >
          {artwork && artwork.created_by && users && (
            <>
              <InputLabel
                htmlFor="uncontrolled-native"
                style={{ paddingRight: 5 }}
              >
                {' '}
                classifications
              </InputLabel>
              <Select
                defaultValue={artwork.classifications}
                labelId="Classification"
                id="demo-simple-select-outlined"
                onChange={(e) => setClassifications(e.target.value)}
                label="classifications"
              >
                <MenuItem value={1} key={1}>
                  Unique
                </MenuItem>
                <MenuItem value={2} key={2}>
                  Limited edition
                </MenuItem>
                <MenuItem value={3} key={3}>
                  Open edition
                </MenuItem>
                <MenuItem value={4} key={4}>
                  Unknown edition
                </MenuItem>
              </Select>
            </>
          )}
        </FormControl>
      ),
    },
    {
      size: 3,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="عرض"
          name="width"
          value={width || ''}
          onChange={(e) => setWidth(e.target.value)}
          margin="normal"
          required
        />
      ),
    },
    {
      size: 3,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="طول"
          name="height"
          value={height || ''}
          onChange={(e) => setHeight(e.target.value)}
          margin="normal"
          required
        />
      ),
    },
    {
      size: 3,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="عمق"
          name="depth"
          value={depth || ''}
          onChange={(e) => setDepth(e.target.value)}
          margin="normal"
          required
        />
      ),
    },
    {
      size: 3,
      field: (
        <FormControl
          variant="outlined"
          margin="normal"
          style={{ minWidth: '100%' }}
        >
          <>
            <InputLabel
              htmlFor="uncontrolled-native"
              style={{ paddingRight: 5 }}
            >
              {' '}
              unit
            </InputLabel>
            <Select
              defaultValue={artwork.unit}
              labelId="unit"
              id="demo-simple-select-outlined"
              onChange={(e) => setUnit(e.target.value)}
              label="unit"
            >
              <MenuItem value={0} key={1}>
                Inch
              </MenuItem>
              <MenuItem value={1} key={2}>
                Cm
              </MenuItem>
            </Select>
          </>
        </FormControl>
      ),
    },
    {
      size: 12,
      field: (
        <Checkboxes
          name="isAnEdition"
          formControlProps={{ margin: 'none' }}
          data={{ label: 'مجموعه', value: isAnEdition }}
          onChange={(e) => setIsAnEdition(e.target.checked)}
        />
      ),
    },
    {
      size: 4,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="شماره کار"
          name="editionNum"
          value={editionNum || ''}
          onChange={(e) => setEditionNum(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 4,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="تعداد کل کار"
          name="editionSize"
          value={editionSize || ''}
          onChange={(e) => setEditionSize(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 4,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="تعداد"
          name="quantity"
          value={quantity || ''}
          onChange={(e) => setQuantity(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 6,
      field: (
        <Checkboxes
          name="is_signed"
          formControlProps={{ margin: 'none' }}
          data={{ label: 'امضا شده', value: is_signed }}
          onChange={(e) => setIsSigned(e.target.checked)}
        />
      ),
    },
    {
      size: 6,
      field: (
        <Checkboxes
          name="is_authenticated"
          formControlProps={{ margin: 'none' }}
          data={{ label: 'authenticity', value: is_authenticated }}
          onChange={(e) => setIsAuthenticated(e.target.checked)}
        />
      ),
    },
    {
      size: 12,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="قاب"
          name="frame"
          value={frame || ''}
          onChange={(e) => setFrame(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 6,
      field: (
        <Checkboxes
          name="isPrice"
          formControlProps={{ margin: 'none' }}
          data={{ label: 'بدون قیمت', value: isPrice }}
          onChange={(e) => setIsPrice(e.target.checked)}
          disabled
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          variant="outlined"
          type="number"
          label="هزینه"
          name="pice"
          value={price || ''}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 12,
      field: (
        <>
          <InputLabel htmlFor="uncontrolled-native" style={{ paddingRight: 5 }}>
            {' '}
            در مورد اثر
          </InputLabel>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Minimum 3 rows"
            style={{ maxWidth: '100%', minWidth: '100%' }}
            value={about_work || ''}
            margin="normal"
            onChange={(e) => setabout_work(e.target.value)}
          />
        </>
      ),
    },
    {
      size: 12,
      field: (
        <>
          <InputLabel htmlFor="uncontrolled-native" style={{ paddingRight: 5 }}>
            {' '}
            پیشنه
          </InputLabel>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Minimum 3 rows"
            style={{ maxWidth: '100%', minWidth: '100%' }}
            value={provenance || ''}
            margin="normal"
            onChange={(e) => setProvenance(e.target.value)}
          />
        </>
      ),
    },
    {
      size: 12,
      field: (
        <FormControl
          variant="outlined"
          margin="normal"
          style={{ minWidth: '100%' }}
        >
          {artwork && artwork.created_by && users && (
            <>
              <InputLabel
                htmlFor="uncontrolled-native"
                style={{ paddingRight: 5 }}
              >
                {' '}
                شهر اثر
              </InputLabel>
              <Select
                defaultValue={1}
                labelId="Classification"
                id="demo-simple-select-outlined"
                onChange={(e) => setart_location(e.target.value)}
                label="art_location"
              >
                <MenuItem value={1} key={1}>
                  تهران
                </MenuItem>
              </Select>
            </>
          )}
        </FormControl>
      ),
    },
  ];
  const classes = useStyles();

  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const onImageChange = async (imageList) => {
    // data for submit
    if (imageList[0]) {
      const formData = new FormData();
      formData.append('image', imageList[0].file);
      formData.append('artworkId', artworkId);

      setImages(imageList);

      setUploading(true);
      try {
        const config = {
          headers: { 'content-Type': 'multipart/form-data' },
        };
        const { data } = await axios.post(
          '/api/artworks/upload/',
          formData,
          config
        );
        setImage(data);
        setUploading(false);
      } catch (error) {
        setUploading(false);
      }
    }
  };
  return (
    <div className={classes.root}>
      <Link to="/admin-panel/artworks">برگشت</Link>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message severity="error">{errorUpdate}</Message>}
      <Typography variant="h6" align="center" sx={{ padding: 2 }}>
        ویرایش {title}
      </Typography>
      {error ? (
        <Message severity="error">{error}</Message>
      ) : loading || loadingUsers || loadingArtistList || loadingTheArtist ? (
        <Loader />
      ) : (
        // image upload section
        <Grid>
          <Box
            sx={{
              width: '100%',
              height: 300,
              marginTop: 2,
              bgcolor: '#f0f0f0',
              ':hover': {
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <ImageUploading
                value={images}
                onChange={onImageChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageUpdate,
                  isDragging,
                  dragProps,
                }) => (
                  <Grid className="upload__image-wrapper">
                    {!imageList[0] && (
                      <Button
                        variant="outlined"
                        style={isDragging ? { color: 'red' } : null}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        آپلود عکس
                      </Button>
                    )}
                    &nbsp;
                    {imageList.map((theImage, index) => (
                      <Grid
                        key={index}
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={theImage.data_url}
                          alt=""
                          width="60%"
                          style={{ maxHeight: 350 }}
                        />

                        <Grid className="image-item__btn-wrapper">
                          <Button
                            variant="outlined"
                            onClick={() => onImageUpdate(index)}
                          >
                            ویرایش
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </ImageUploading>
            </Grid>
          </Box>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            initialValues={{
              isAnEdition,
              is_signed,
              is_authenticated,
              isPrice,
            }}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Grid container alignItems="flex-start" spacing={2}>
                  {formFields.map((item, idx) => (
                    <Grid item xs={item.size} key={idx}>
                      {item.field}
                    </Grid>
                  ))}
                  <Grid item xs={12} style={{ marginTop: 16 }}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={submitting}
                      fullWidth
                    >
                      ذخیره
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          />
        </Grid>
      )}
    </div>
  );
}
