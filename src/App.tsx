import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Docs from "./pages/Docs";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path='/docs' component={Docs}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
