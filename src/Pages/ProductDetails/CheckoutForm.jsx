import React, { useEffect, useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { useOutletContext } from 'react-router';

const CheckoutForm = ({ selectedProduct }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, token } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const { theme } = useOutletContext();

  const amount = parseInt(selectedProduct?.prices?.[0]?.price || '0') * 100;

  useEffect(() => {
    if (!amount) return;
    axios
      .post(
        'https://price-tracker-of-market-server.onrender.com/create-payment-intent',
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(() => toast.error('Unable to start payment process.'));
  }, [amount, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: paymentMethod.id }
    );

    if (confirmError) {
      toast.error(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      const paymentData = {
        userEmail: user?.email,
        userName: user?.displayName,
        amount,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        productId: selectedProduct._id,
        productName: selectedProduct.itemName,
        marketName: selectedProduct.marketName,
        date: new Date().toISOString().split('T')[0],
      };

      axios
        .post('https://price-tracker-of-market-server.onrender.com/payments', paymentData)
        .then(() => toast.success('Payment successful! Thank you.'));

      setPaymentSucceeded(true);
    }
    setProcessing(false);
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div
        className={`shadow-lg rounded-xl max-w-md w-full p-8 transition ${
          theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Pay for Parcel Pickup
        </h2>

        {paymentSucceeded ? (
          <div className="text-center text-green-600 font-semibold text-lg">
            🎉 Your payment was successful!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium">Card details</label>
            <div
              className={`border rounded-md p-3 mb-6 focus-within:ring-2 ${
                theme === 'dark'
                  ? 'border-gray-600 focus-within:ring-orange-400'
                  : 'border-gray-300 focus-within:ring-orange-500'
              }`}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: theme === 'dark' ? '#F9FAFB' : '#1a202c',
                      '::placeholder': {
                        color: theme === 'dark' ? '#9CA3AF' : '#a0aec0',
                      },
                    },
                    invalid: {
                      color: '#e53e3e',
                    },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!stripe || !clientSecret || processing}
              className={`w-full py-3 rounded-md font-semibold transition ${
                processing
                  ? 'bg-orange-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {processing ? 'Processing...' : `Pay ৳${amount / 100}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
