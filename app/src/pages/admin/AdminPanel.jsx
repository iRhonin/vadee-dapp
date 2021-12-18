/* eslint-disable no-nested-ternary */
import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminBreadcrumbs from '../../components/admin/Breadcrumbs';
import OrderList from '../../components/admin/OrderList';
import ArtworkList from '../../components/admin/ArtworkList';
import UserList from '../../components/admin/UserList';
import ArtistList from '../../components/admin/ArtistList';

function AdminPanel() {
  const { route } = useParams();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }
  }, [history, userInfo]);

  return (
    <Grid
      container
      direction="column"
      // justifyContent="center"
      alignItems="center"
      sx={{ marginTop: 15, minHeight: '100vh' }}
    >
      <AdminBreadcrumbs />
      {route === 'users' ? (
        <UserList />
      ) : route === 'artworks' ? (
        <ArtworkList />
      ) : route === 'artists' ? (
        <ArtistList />
      ) : route === 'orders' ? (
        <OrderList />
      ) : null}
    </Grid>
  );
}

export default AdminPanel;
