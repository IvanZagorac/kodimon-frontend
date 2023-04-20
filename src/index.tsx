import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage";
import BattlePage from "./components/BattlePage";
import HistoryBattlePage from "./components/HistoryBattlePage";
import BattleNewOpponent from "./components/BattleNewOpponent";



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/battle" element={<BattlePage/>}/>
              <Route path="/history" element={<HistoryBattlePage/>}/>
              <Route path="/newOpponent" element={<BattleNewOpponent/>}/>
          </Routes>
      </BrowserRouter>

  </React.StrictMode>
);

reportWebVitals();
