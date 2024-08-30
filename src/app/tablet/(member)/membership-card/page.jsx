'use client';

import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import axios from 'axios';

import { AuthContext } from '@/context/AuthContext';
import { ENDPOINT } from '@/endpoints'; // Import your ENDPOINTS

const Page = () => {
  const { orderId } = useContext(AuthContext); // Get orderId from context
  const [orderStatus, setOrderStatus] = useState(null); // State to store order status
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const router = useRouter()

  useEffect(() => {
    if (orderId) {
      const fetchOrderStatus = async () => {
        setLoading(true);

        try {
          const response = await axios.post(ENDPOINT.ORDER_STATUS, {
            order_id: orderId
          });

          setOrderStatus(response.data.paymentStatus); // Set order status data

          if(response.data.paymentStatus == 'PAID'){
            router.push("/tablet/waiting")
          }
        } catch (err) {
          console.error('Failed to fetch order status:', err);
          setError('Failed to fetch order status.'); // Set error message
        } finally {
          setLoading(false); // Set loading to false when done
        }
      };

      fetchOrderStatus();
    }
  }, [orderId]); // Dependency on orderId

  return (
    <>
      <div className='absolute z-40 top-8 left-7'>
        <h2 className='text-[#1f1f1f] text-3xl font-bold text-left'>Tap your Membership Card</h2>
      </div>
      <div className='flex flex-col gap-8 justify-center items-center w-full h-full text-center'>
        <h4 className='text-xl font-medium text-[#1F1F1F]'>
          Tap your beer membership card on the machine marked with the sign below to start pouring your fresh beer.
        </h4>
        <div className='shadow-[0_0_10px_#00000029] w-full max-w-[480px] py-[40px] rounded-[10px]'></div>
        {loading && <p>Loading order status...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {orderStatus && (
          <div>
            <h5 className='text-lg font-bold'>Payment Status:</h5>
            <p>{orderStatus}</p> {/* Adjust based on your API response */}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
