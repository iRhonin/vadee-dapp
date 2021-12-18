/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrderList } from '../../actions/index';
import Loader from '../Loader';
import Message from '../Message';
import { AccountUserOrdersCard } from './ProfileOrdersCard';

export default function SideFilter() {
  const dispatch = useDispatch();
  // const [expanded, setExpanded] = useState(false);

  const myOrders = useSelector((state) => state.myOrders);
  const { theMyOrders, loading, error } = myOrders;

  useEffect(() => {
    if (!theMyOrders || !theMyOrders[0] || loading) {
      dispatch(fetchUserOrderList());
    }
    return () => {
      // dispatch(cleanMyOrders());
    };
  }, [dispatch, loading, theMyOrders]);

  const renderElement = () => (
    <>
      {!theMyOrders || !theMyOrders.map ? (
        <Loader />
      ) : (
        <div>
          {theMyOrders.map((order) => (
            <div key={order._id}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel-bh-content"
                  id="panel-bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {`تاریخ ثبت: ${order.created_at} `}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AccountUserOrdersCard order={order} />
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </>
  );
  return (
    <>
      {!loading && (theMyOrders === undefined || !theMyOrders[0]) ? (
        <Message variant="outlined" severity="info">
          شما هنوز خریدی انچام ندادید
        </Message>
      ) : error ? (
        <Message variant="outlined" severity="error">
          {error}
        </Message>
      ) : (
        renderElement()
      )}
    </>
  );
}
