import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Arch from '../system-components/Architecture';

function Home() {

    return (
        <div className="home-content">
            <Header />
            {/*<div className='system-component'>
                <Cpu />
            </div>*/}
            <div className='system-component'>
                <Arch />
            </div>
            <div className='system-component'>

            </div>
            <Footer />
        </div>
    );
}

export default Home;