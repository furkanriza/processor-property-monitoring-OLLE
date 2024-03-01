import React from 'react';
import Header from './Header';

import SystemDetails from '../system-details-viewer/SystemDetails';

function Home() {

    return (
        <div className="home-content">
            {/*<Header />*/}

            <SystemDetails />

           
        </div>
    );
}

export default Home;