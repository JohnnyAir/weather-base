import { Link } from "react-router-dom";

interface Props {}

function FourZeroFour(props: Props) {
  const {} = props;

  return (
    <div className="card">
      <div className="a404">
        <p>404</p>
        <p>Page not found</p>
        <Link to="/"> Go Home </Link>
      </div>
    </div>
  );
}

export default FourZeroFour;
