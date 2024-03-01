import React, { useState, useEffect } from 'react';
import './Style.css';
import { decodeFromMorse } from '../../utils/MorseCodeUtils';
import ProcessorInfo from './ProcessorInfo';
import OtherSystemInfo from './OtherSystemInfo';

function SystemDetails() {
    const [data, setData] = useState({ checksum: '', data: [] });
    const [otherData, setOtherData] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
    const [updateArrival, setUpdateArrival] = useState(3);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const commands = [
        '-.-. .--. ..-', '.- .-. -.-. ....', '..-. .-. . . -- . --',
        '.... --- ... - -. .- -- .', '.--. .-.. .- - ..-. --- .-. --',
        '- --- - .- .-.. -- . --', '- -.-- .--. .', '..- .--. - .. -- .'
    ];

    const simpleChecksum = (data) => data.reduce((acc, item) => acc + JSON.stringify(item).length, 0).toString();

    const fetchData = (commandType) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const apiData = JSON.parse(xhr.responseText);
                        resolve(apiData);
                    } else {
                        reject(new Error('There was a problem with the AJAX request:', xhr.statusText));
                    }
                }
            };

            xhr.open('POST', 'http://ik.olleco.net/morse-api/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                command: commandType
            }));
        });
    };

    const fetchAllData = () => {
        Promise.all(commands.map(command => fetchData(command)))
            .then(dataArray => {
                const providedChecksum = dataArray[0].checksum;
                const apiData = dataArray[0].data;

                // Compute the checksum of the received data
                // not successfull due to absence of checksum algorithm information
                const computedChecksum = simpleChecksum(apiData);
                if (computedChecksum !== providedChecksum) {
                    console.log('Checksum verification failed. Data may be corrupted.\n (Checksum verification could not succeed in this version due to absence of checksum algorithm information');
                    //setIsDataFetched(false);
                    //return;
                } else {
                    console.log('Checksum verified successfully.');
                }

                const decodedProcessorData = apiData.map(item => ({
                    ...item,
                    model: decodeFromMorse(item.model),
                    speed: decodeFromMorse(item.speed),
                    times: Object.entries(item.times).reduce((acc, [key, value]) => {
                        acc[key] = decodeFromMorse(value);
                        return acc;
                    }, {})
                }));

                setData({ ...dataArray[0], data: decodedProcessorData });

                // update `otherData` with all info other than cpu
                const processedData = dataArray.slice(1).reduce((acc, data, index) => {
                    const keyMap = ['arch', 'freemem', 'hostname', 'platform', 'totalmem', 'type', 'uptime'];
                    const propertyMap = {
                        'arch': "Architecture: ",
                        'freemem': "Free system memory: ",
                        'hostname': "Hostname: ",
                        'platform': "Platform: ",
                        'totalmem': "Total Memory: ",
                        'type': "Type: ",
                        'uptime': "Uptime: "
                    };

                    const decodedStr = decodeFromMorse(data.data);
                    acc[keyMap[index]] = {
                        property: propertyMap[keyMap[index]],
                        decodedData: decodedStr
                    };
                    return acc;
                }, {});

                setOtherData(processedData);
                setIsDataFetched(true);
                setCurrentTime(new Date().toLocaleTimeString());
                console.log('Processed and set other data successfully:', processedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsDataFetched(false);
            });
    };

    useEffect(() => {
        let interval;

        if (autoUpdateEnabled) {
            fetchAllData();
            if (updateArrival < 1 || updateArrival > 2147483647) {
                setUpdateArrival(1000);
            }
            interval = setInterval(fetchAllData, updateArrival * 1000);
        }

        return () => clearInterval(interval);
    }, [autoUpdateEnabled, updateArrival]);

    const handleStopAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(false);
    };

    const handleStartAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(true);
    };

    const handleUpdateInfosClick = () => {
        fetchAllData();
    };

    const handleUpdateArrivalChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setUpdateArrival(value);
    };

    return (
        <>
            {!isDataFetched && (
                <div className='update-button-container'>
                    <button className='update-button' onClick={fetchAllData}>Fetch Data</button>
                </div>
            )}
            {isDataFetched && (
                <>
                    <div className='all-info-title'>
                        <h3>System Details</h3>
                    </div>
                    <div className='all-info'>
                        <ProcessorInfo data={data.data} />
                        <OtherSystemInfo otherData={otherData} />
                    </div>
                    <div className='time-indicator'>
                        <h2>Last Update: {currentTime}</h2>
                    </div>
                    <div className='update-button-container'>
                        Enter the time arrival:  &nbsp; &nbsp;
                        <input className='time-arrival-input-box' type="number" value={updateArrival} min="1" max="1000000" onChange={handleUpdateArrivalChange} />
                        {autoUpdateEnabled ? (
                            <button className='update-button' onClick={handleStopAutomaticUpdateClick}>Stop Automatic Update</button>
                        ) : (
                            <button className='update-button' onClick={handleStartAutomaticUpdateClick}>Start Automatic Update</button>
                        )}


                        <button className='update-button' onClick={handleUpdateInfosClick}>Update Infos</button>
                    </div>
                </>
            )}
        </>
    );
}

export default SystemDetails;


/*import React, { useState, useEffect } from 'react';
import './Style.css';
import { decodeFromMorse } from '../../utils/MorseCodeUtils';
import ProcessorInfo from './ProcessorInfo';
import OtherSystemInfo from './OtherSystemInfo';

function SystemDetails() {
    const [data, setData] = useState({ checksum: '', data: [] });
    const [otherData, setOtherData] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
    const [updateArrival, setUpdateArrival] = useState(10);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const commands = [
        '-.-. .--. ..-', '.- .-. -.-. ....', '..-. .-. . . -- . --',
        '.... --- ... - -. .- -- .', '.--. .-.. .- - ..-. --- .-. --',
        '- --- - .- .-.. -- . --', '- -.-- .--. .', '..- .--. - .. -- .'
    ];

    const simpleChecksum = (data) => data.reduce((acc, item) => acc + JSON.stringify(item).length, 0).toString();

    const fetchData = (commandType) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const apiData = JSON.parse(xhr.responseText);
                        resolve(apiData);
                    } else {
                        reject(new Error('There was a problem with the AJAX request:', xhr.statusText));
                    }
                }
            };

            xhr.open('POST', 'http://ik.olleco.net/morse-api/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                command: commandType
            }));
        });
    };

    const fetchAllData = () => {
        Promise.all(commands.map(command => fetchData(command)))
            .then(dataArray => {
                const providedChecksum = dataArray[0].checksum;
                const apiData = dataArray[0].data;

                const computedChecksum = simpleChecksum(apiData);
                if (computedChecksum !== providedChecksum) {
                    console.log('Checksum verification failed. Data may be corrupted.\n (Checksum verification could not succeed in this version due to absence of checksum algorithm information');
                } else {
                    console.log('Checksum verified successfully.');
                }

                const decodedProcessorData = apiData.map(item => ({
                    ...item,
                    model: decodeFromMorse(item.model),
                    speed: decodeFromMorse(item.speed),
                    times: Object.entries(item.times).reduce((acc, [key, value]) => {
                        acc[key] = decodeFromMorse(value);
                        return acc;
                    }, {})
                }));

                setData({ ...dataArray[0], data: decodedProcessorData });

                const processedData = dataArray.slice(1).reduce((acc, data, index) => {
                    const keyMap = ['arch', 'freemem', 'hostname', 'platform', 'totalmem', 'type', 'uptime'];
                    const propertyMap = {
                        'arch': "Architecture: ",
                        'freemem': "Free system memory: ",
                        'hostname': "Hostname: ",
                        'platform': "Platform: ",
                        'totalmem': "Total Memory: ",
                        'type': "Type: ",
                        'uptime': "Uptime: "
                    };

                    const decodedStr = decodeFromMorse(data.data);
                    acc[keyMap[index]] = {
                        property: propertyMap[keyMap[index]],
                        decodedData: decodedStr
                    };
                    return acc;
                }, {});

                setOtherData(processedData);
                setIsDataFetched(true);
                setCurrentTime(new Date().toLocaleTimeString());
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsDataFetched(false);
            });
    };

    useEffect(() => {
        let interval;

        if (autoUpdateEnabled) {
            fetchAllData();
            interval = setInterval(fetchAllData, updateArrival * 1000);
        }

        return () => clearInterval(interval);
    }, [autoUpdateEnabled, updateArrival]);

    const handleStopAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(false);
    };

    const handleStartAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(true);
    };

    const handleUpdateInfosClick = () => {
        fetchAllData();
    };

    const handleUpdateArrivalChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setUpdateArrival(value);
    };

    return (
        <>
            {!isDataFetched && (
                <div className='update-button-container'>
                    <button className='update-button' onClick={fetchAllData}>Fetch Data</button>
                </div>
            )}
            {isDataFetched && (
                <>
                    <div className='all-info-title'>
                        <h3>System Details</h3>
                    </div>
                    <div className='all-info'>
                        <ProcessorInfo data={data.data} />
                        <OtherSystemInfo otherData={otherData} />
                    </div>
                    <div className='time-indicator'>
                        <h2>Current Time: {currentTime}</h2>
                    </div>
                    <div className='update-button-container'>
                        <button className='update-button' onClick={handleUpdateInfosClick}>Update Infos</button>
                        {autoUpdateEnabled ? (
                            <button className='update-button' onClick={handleStopAutomaticUpdateClick}>Stop Automatic Update</button>
                        ) : (
                            <button className='update-button' onClick={handleStartAutomaticUpdateClick}>Start Automatic Update</button>
                        )}
                        <input type="number" value={updateArrival} onChange={handleUpdateArrivalChange} />
                    </div>
                </>
            )}
        </>
    );
}

export default SystemDetails;
*/


/*import React, { useState, useCallback } from 'react';
import './Style.css';
import { decodeFromMorse } from '../../utils/MorseCodeUtils';
import ProcessorInfo from './ProcessorInfo';
import OtherSystemInfo from './OtherSystemInfo';

function SystemDetails() {
    const [data, setData] = useState({ checksum: '', data: [] });
    const [otherData, setOtherData] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
    const [updateArrival, setUpdateArrival] = useState(10);
    const [lastCheckTime, setLastCheckTime] = useState(new Date().toLocaleTimeString());

    const commands = [
        '-.-. .--. ..-', '.- .-. -.-. ....', '..-. .-. . . -- . --',
        '.... --- ... - -. .- -- .', '.--. .-.. .- - ..-. --- .-. --',
        '- --- - .- .-.. -- . --', '- -.-- .--. .', '..- .--. - .. -- .'
    ];

    const fetchData = (commandType) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const apiData = JSON.parse(xhr.responseText);
                        resolve(apiData);
                    } else {
                        reject(new Error('There was a problem with the AJAX request:', xhr.statusText));
                    }
                }
            };

            xhr.open('POST', 'http://ik.olleco.net/morse-api/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                command: commandType
            }));
        });
    };

    const simpleChecksum = (data) => data.reduce((acc, item) => acc + JSON.stringify(item).length, 0).toString();

    const handleStopAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(false);
    };

    const handleStartAutomaticUpdateClick = () => {
        let interval;

        if (isDataFetched && autoUpdateEnabled) {
            fetchAllData();
            interval = setInterval(fetchAllData, updateArrival * 1000);
            setAutoUpdateEnabled(true);
        }

        
        return () => clearInterval(interval);

    };

    const handleUpdateInfosClick = () => {
        fetchAllData();
    };

    const handleUpdateArrivalChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setUpdateArrival(value);
    };

    const fetchAllData = useCallback(() => {
        Promise.all(commands.map(command => fetchData(command)))
            .then(dataArray => {
                const providedChecksum = dataArray[0].checksum;
                const apiData = dataArray[0].data;

                const computedChecksum = simpleChecksum(apiData);
                if (computedChecksum !== providedChecksum) {
                    console.log('Checksum verification failed. Data may be corrupted.\n (Checksum verification could not succeed in this version due to absence of checksum algorithm information');
                } else {
                    console.log('Checksum verified successfully.');
                }

                const decodedProcessorData = apiData.map(item => ({
                    ...item,
                    model: decodeFromMorse(item.model),
                    speed: decodeFromMorse(item.speed),
                    times: Object.entries(item.times).reduce((acc, [key, value]) => {
                        acc[key] = decodeFromMorse(value);
                        return acc;
                    }, {})
                }));

                setData({ ...dataArray[0], data: decodedProcessorData });

                const processedData = dataArray.slice(1).reduce((acc, data, index) => {
                    const keyMap = ['arch', 'freemem', 'hostname', 'platform', 'totalmem', 'type', 'uptime'];
                    const propertyMap = {
                        'arch': "Architecture: ",
                        'freemem': "Free system memory: ",
                        'hostname': "Hostname: ",
                        'platform': "Platform: ",
                        'totalmem': "Total Memory: ",
                        'type': "Type: ",
                        'uptime': "Uptime: "
                    };

                    const decodedStr = decodeFromMorse(data.data);
                    acc[keyMap[index]] = {
                        property: propertyMap[keyMap[index]],
                        decodedData: decodedStr
                    };
                    return acc;
                }, {});

                setOtherData(processedData);
                setIsDataFetched(true);
                setLastCheckTime(new Date().toLocaleTimeString());
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsDataFetched(false);
            });
    }, [commands, fetchData]);


    return (
        <>
            {!isDataFetched && (
                <div className='update-button-container'>
                    <button className='update-button' onClick={fetchAllData}>Fetch Data</button>
                </div>
            )}
            {isDataFetched && (
                <>
                    <div className='all-info-title'>
                        <h3>System Details</h3>
                    </div>
                    <div className='all-info'>
                        <ProcessorInfo data={data.data} />
                        <OtherSystemInfo otherData={otherData} />
                    </div>
                    <div className='time-indicator'>
                        <h2>Last Check: {lastCheckTime}</h2>
                    </div>
                    <div className='update-button-container'>
                        <button className='update-button' onClick={handleUpdateInfosClick}>Update Infos</button>
                        <input className='time-arrival-input-box' type="number" value={updateArrival} onChange={handleUpdateArrivalChange} />
                        <button className='update-button' onClick={handleStartAutomaticUpdateClick}>Start Automatic Update</button>
                        <button className='update-button' onClick={handleStopAutomaticUpdateClick}>Stop Automatic Update</button>
                    </div>
                </>
            )}
        </>
    );
}

export default SystemDetails;
*/



/*import React, { useState, useEffect, useCallback } from 'react';
import './Style.css';
import { decodeFromMorse } from '../../utils/MorseCodeUtils';
import ProcessorInfo from './ProcessorInfo';
import OtherSystemInfo from './OtherSystemInfo';

function SystemDetails() {
    const [data, setData] = useState({ checksum: '', data: [] });
    const [otherData, setOtherData] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
    const [updateArrival, setUpdateArrival] = useState(10);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const commands = [
        '-.-. .--. ..-', '.- .-. -.-. ....', '..-. .-. . . -- . --',
        '.... --- ... - -. .- -- .', '.--. .-.. .- - ..-. --- .-. --',
        '- --- - .- .-.. -- . --', '- -.-- .--. .', '..- .--. - .. -- .'
    ];

    const simpleChecksum = (data) => data.reduce((acc, item) => acc + JSON.stringify(item).length, 0).toString();


    const handleStopAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(false);
    };

    const handleStartAutomaticUpdateClick = () => {
        setAutoUpdateEnabled(true);
    };

    const handleUpdateInfosClick = () => {
        fetchAllData();
    };

    const handleUpdateArrivalChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setUpdateArrival(value);
    };

    const fetchAllData = () => {
        Promise.all(commands.map(command => fetchData(command)))
            .then(dataArray => {
                const providedChecksum = dataArray[0].checksum;
                const apiData = dataArray[0].data;

                const computedChecksum = simpleChecksum(apiData);
                if (computedChecksum !== providedChecksum) {
                    console.log('Checksum verification failed. Data may be corrupted.\n (Checksum verification could not succeed in this version due to absence of checksum algorithm information');
                } else {
                    console.log('Checksum verified successfully.');
                }

                const decodedProcessorData = apiData.map(item => ({
                    ...item,
                    model: decodeFromMorse(item.model),
                    speed: decodeFromMorse(item.speed),
                    times: Object.entries(item.times).reduce((acc, [key, value]) => {
                        acc[key] = decodeFromMorse(value);
                        return acc;
                    }, {})
                }));

                setData({ ...dataArray[0], data: decodedProcessorData });

                const processedData = dataArray.slice(1).reduce((acc, data, index) => {
                    const keyMap = ['arch', 'freemem', 'hostname', 'platform', 'totalmem', 'type', 'uptime'];
                    const propertyMap = {
                        'arch': "Architecture: ",
                        'freemem': "Free system memory: ",
                        'hostname': "Hostname: ",
                        'platform': "Platform: ",
                        'totalmem': "Total Memory: ",
                        'type': "Type: ",
                        'uptime': "Uptime: "
                    };

                    const decodedStr = decodeFromMorse(data.data);
                    acc[keyMap[index]] = {
                        property: propertyMap[keyMap[index]],
                        decodedData: decodedStr
                    };
                    return acc;
                }, {});

                setOtherData(processedData);
                setIsDataFetched(true);
                setCurrentTime(new Date().toLocaleTimeString());
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsDataFetched(false);
            });
    };

    useEffect(() => {
        let interval;

        if (isDataFetched && autoUpdateEnabled) {
            fetchAllData();
            interval = setInterval(fetchAllData, updateArrival * 1000);
        }


        return () => clearInterval(interval);
    }, [isDataFetched, autoUpdateEnabled, updateArrival, fetchAllData]);


    const fetchData = (commandType) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const apiData = JSON.parse(xhr.responseText);
                        resolve(apiData);
                    } else {
                        reject(new Error('There was a problem with the AJAX request:', xhr.statusText));
                    }
                }
            };

            xhr.open('POST', 'http://ik.olleco.net/morse-api/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                command: commandType
            }));
        });
    };


    return (
        <>
            {!isDataFetched && (
                <div className='update-button-container'>
                    <button className='update-button' onClick={fetchAllData}>Fetch Data</button>
                </div>
            )}
            {isDataFetched && (
                <>
                    <div className='all-info-title'>
                        <h3>System Details</h3>
                    </div>
                    <div className='all-info'>
                        <ProcessorInfo data={data.data} />
                        <OtherSystemInfo otherData={otherData} />
                    </div>
                    <div className='time-indicator'>
                        <h2>Current Time: {currentTime}</h2>
                    </div>
                    <div className='update-button-container'>
                        <button className='update-button' onClick={handleUpdateInfosClick}>Update Infos</button>
                        <button className='update-button' onClick={handleStopAutomaticUpdateClick}>Stop Automatic Update</button>
                        <input type="number" value={updateArrival} onChange={handleUpdateArrivalChange} />
                        <button className='update-button' onClick={handleStartAutomaticUpdateClick}>Start Automatic Update</button>
                    </div>
                </>
            )}
        </>
    );
}

export default SystemDetails;*/