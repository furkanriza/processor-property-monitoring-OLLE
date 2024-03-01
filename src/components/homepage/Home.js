import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SystemDetailsViewer from './SystemDetailsViewer';

function Home() {

    return (
        <div className="home-content">
            <Header />
            {/*<div className='system-component'>
                <Cpu />
            </div>*/}
            <div className='system-component'>
                <SystemDetailsViewer />
            </div>
            <div className='system-component'>

            </div>
            <Footer />
        </div>
    );
}

export default Home;