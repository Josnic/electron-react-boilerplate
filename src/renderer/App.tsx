import { Provider } from 'react-redux';
import AuthStore from './redux/stores';
import RouteApp from './route';
import './styles/globals.scss';


export default function App() {
  return (
    <Provider store={AuthStore}>
      <RouteApp />
    </Provider>
  );
}
