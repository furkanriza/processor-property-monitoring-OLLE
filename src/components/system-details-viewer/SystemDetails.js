import React, { useState } from 'react';
import './Style.css';
import { decodeFromMorse } from '../../utils/MorseCodeUtils';
import ProcessorInfo from './ProcessorInfo';
import OtherSystemInfo from './OtherSystemInfo';

function SystemDetailsViewer() {
    const [data, setData] = useState({ checksum: '', data: [] });
    const [otherData, setOtherData] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);

    const commands = [
        '-.-. .--. ..-', '.- .-. -.-. ....', '..-. .-. . . -- . --',
        '.... --- ... - -. .- -- .', '.--. .-.. .- - ..-. --- .-. --',
        '- --- - .- .-.. -- . --', '- -.-- .--. .', '..- .--. - .. -- .'
    ];

    /*useEffect(() => {
        fetchAllData();
    }, []);*/

    const fetchAllData = () => {
        // fetch all data in parallel
        Promise.all(commands.map(command => fetchData(command)))
            .then(dataArray => {
                console.log('Fetched data successfully:', dataArray); // Log the fetched data array
                // for CPU data, and it's the first command
                setData(dataArray[0]); // This sets the CPU data directly

                // update otherData with all other info
                const processedData = dataArray.slice(1).reduce((acc, data, index) => {
                    // Assuming the order of commands matches the data processing order
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
                console.log('Processed and set other data successfully:', processedData); // Log the processed other data
                setIsDataFetched(true);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsDataFetched(false);
            });
    };

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
                    <div className='update-button-container'>
                        <button className='update-button' onClick={fetchAllData}>Update Infos</button>
                    </div>
                </>
            )}
        </>
    );
}

export default SystemDetailsViewer;
