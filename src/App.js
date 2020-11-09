import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/home-component/Home';
import Company from './components/company-component/Company';
import Error from './components/error-component/Error';
import './App.css';

function App() {
  return (
    <main>
      <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/home" component={Home} />
          <Route path="/company" component={Company} />
          <Route component={Error} />
      </Switch>
    </main>

  );
}

export default App;
