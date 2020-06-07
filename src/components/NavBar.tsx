import React from "react";
import {Link} from "react-router-dom";

function NavBar() {
    return (
        <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/Docs'>Docs</Link></li>
        </ul>
        // <div className="App">
        //         <header className="App-header">
        //             <img src={logo} className="App-logo" alt="logo"/>
        //             <p>
        //                 Edit <code>src/App.tsx</code> and save to reload.
        //             </p>
        //             <a
        //                 className="App-link"
        //                 href="https://reactjs.org"
        //                 target="_blank"
        //                 rel="noopener noreferrer"
        //             >
        //                 Learn React
        //             </a>
        //         </header>
        //     </div>
    );
}

export default NavBar;
