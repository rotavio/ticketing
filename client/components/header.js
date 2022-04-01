import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Signup", href: "/auth/signup" },
    !currentUser && { label: "Signin", href: "/auth/signin" },
    currentUser && { label: "Sell a ticket", href: "/tickets/new" },
    currentUser && { label: "My orders", href: "/orders" },
    currentUser && { label: "Signout", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">
          <a href="" className="navbar-brand">
            Ticketing.dev
          </a>
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{links}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
