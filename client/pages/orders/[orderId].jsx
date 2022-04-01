import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    method: "post",
    url: "/api/payments",
    body: { orderId: order.id },
    onSuccess: () => {
      Router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // return from useEffect
    // invoked when component is about to be rerender or
    // we navigate away (destroy? unmount?)
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <h1>Order #{order.id}</h1>
      <p>Time left: {timeLeft} seconds</p>
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        amount={order.ticket.price * 100}
        stripeKey="pk_test_hhwBDp3HQUT3VYr62Zq3r0yf"
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
