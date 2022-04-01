import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => {
      // console.log(order);
      Router.push("/orders/[ticketId]", `/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <p>Price: $ {ticket.price}</p>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Buy ticket
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
