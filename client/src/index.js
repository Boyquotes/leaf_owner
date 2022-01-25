import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import './index.css'
import Home from './pages/Home'
import Mint from './pages/Mint'
import NFT from './pages/NFT'
import Roadmap from './pages/Roadmap'
import Team from './pages/Team'
import About from './pages/About'
import Header from './components/Header'
import Error from './components/Error'
import App from './App';

import GlobalStyle from './utils/style/GlobalStyle'
import { ThemeProvider } from './utils/context'
//import 'bootstrap/dist/css/bootstrap.min.css'

//import * as serviceWorker from './serviceWorker';

ReactDOM.render(
//	<App />,
//	 document.getElementById('root')
//);
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <GlobalStyle />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/NFT" element={<NFT />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/team" element={<Team />} />
            <Route path="/about" element={<About />} />
          </Routes>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
	 document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
