import React from 'react';
import AppBackground from '../components/AppBackground';
import OrderListItem from '../components/OrderListItem';
import { useRoute } from '@react-navigation/native';

export default function OrderDetails() {
  const route = useRoute();
  
  return (
    <AppBackground>
      <OrderListItem
        item={route.params.order}
      />    
    </AppBackground>
  );
}
