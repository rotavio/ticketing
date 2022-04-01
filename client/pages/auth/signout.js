import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

const Signout = () => {
  const { doRequest } = useRequest({
    method: "post",
    url: "/api/users/signout",
    body: {},
    onSuccess: () => {
      Router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
};

export default Signout;
