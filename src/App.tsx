import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import Home from "./components/Home";
import Docs from "./components/Docs";

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
