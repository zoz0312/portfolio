import { Route, RouteComponentProps } from "react-router-dom"
import Home from './aju.Home';
import AJuAbout from './aju.About';
import MainAnimation from '@components/animations/main.animation';

const AJu: React.FC<RouteComponentProps> = (
  { match }: RouteComponentProps,
): JSX.Element => {
  return (
    <>
      <Route exact path={`${match.path}`} component={Home} />
      <Route path={`${match.path}/about`} component={AJuAbout} />
    </>
  );
}

export default AJu;
