/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { TextField, Checkboxes } from 'mui-rff';
import { Typography, Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  headerStatus,
  fetchUserDetails,
  updateUser,
} from '../../actions/index.js';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

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

const validate = (email) => {
  const errors = {};
  if (!email) {
    errors.email = 'لطفا ایمیل خود را وارد کنید';
  }
  return errors;
};

export default function UserEdit() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const { userId } = useParams();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      history.push('/admin-panel/users');
    } else if (!user.firstName || user._id !== Number(userId)) {
      dispatch(fetchUserDetails(userId));
    } else {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user, userId, dispatch, successUpdate, history]);

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
      updateUser({ _id: user._id, firstName, lastName, email, isAdmin })
    );
  };

  const formFields = [
    {
      size: 12,
      field: (
        <TextField
          variant="outlined"
          type="email"
          label="ایمیل"
          name="email"
          margin="normal"
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      ),
    },

    {
      size: 12,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="نام"
          name="firstName"
          value={firstName || ''}
          onChange={(e) => setFirstName(e.target.value)}
          margin="normal"
          required
        />
      ),
    },
    {
      size: 12,
      field: (
        <TextField
          variant="outlined"
          type="name"
          label="نام خانوادگی"
          name="lastName"
          value={lastName || ''}
          onChange={(e) => setLastName(e.target.value)}
          margin="normal"
        />
      ),
    },
    {
      size: 12,
      field: (
        <Checkboxes
          name="isAdmin"
          formControlProps={{ margin: 'none' }}
          data={{ label: 'ادمین', value: isAdmin }}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
      ),
    },
  ];
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Link to="/admin-panel/users">برگشت</Link>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message severity="error">{errorUpdate}</Message>}
      <Typography variant="h6" align="center" sx={{ padding: 2 }}>
        ویرایش کاربر
      </Typography>
      {error ? (
        <Message severity="error">{error}</Message>
      ) : loading ? (
        <Loader />
      ) : (
        <Form
          onSubmit={onSubmit}
          validate={validate}
          initialValues={{ isAdmin }}
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
      )}
    </div>
  );
}
