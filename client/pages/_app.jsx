import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/header";
import Layout from "../components/layout";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Layout>
        <Component currentUser={currentUser} {...pageProps} />
      </Layout>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client
    .get("/api/users/currentuser")
    .catch((err) => console.log(err.message));

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
  }

  return { pageProps, ...data };
};

export default AppComponent;
