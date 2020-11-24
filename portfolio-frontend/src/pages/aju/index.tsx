import { Route, RouteComponentProps } from "react-router-dom"
import Home from './aju.Home';
import About from './aju.About';

const AJu: React.FC<RouteComponentProps> = ({ match }: RouteComponentProps) => {
  console.log('props', match)
  return (
    <>
      <Route exact path={`${match.path}`} component={Home} />
      <Route path={`${match.path}/about`} component={About} />
    </>
  );
}

export default AJu;
