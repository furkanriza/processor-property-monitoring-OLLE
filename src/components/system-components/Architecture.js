import React, { useState } from 'react';
import './Style.css';
import { decodeFromMorse } from '../../utils/MorseCodeUtils';

function Arch() {
    const [data, setData] = useState({
        checksum: '',
        data: []
    });

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
                // Assuming setData is for CPU data, and it's the first command
                setData(dataArray[0]); // This sets the CPU data directly

                // Now, process and update otherData with all other info
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
                console.log(otherData);
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
                        resolve(apiData); // Resolve with the API data
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

            {!isDataFetched && (<><div className='update-button-container'><button  className='update-button' onClick={fetchAllData}>fetch data</button></div></>)}
            {isDataFetched && (<>
                <div className='all-info-title'>
                    <h3>System Details</h3>
                </div>
                <div className='all-info'>
                    <div className="processor-info">
                        {/* Table for displaying the cpu informations */}
                        {data.data && data.data.length > 0 && data.data.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className='processor-component'>
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th className='table-title'>Processor Information</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td className="property-name">Model </td>
                                                <td className="property-value">{decodeFromMorse(item.model)}</td>
                                            </tr>
                                            <tr>
                                                <td className="property-name">Speed</td>
                                                <td className="property-value">{decodeFromMorse(item.speed)}</td>
                                            </tr>
                                            <tr>
                                                <td className="property-name">Times</td>
                                                <td className="property-value">
                                                    <table>
                                                        <tbody>
                                                            {Object.entries(item.times).map(([timeKey, timeValue], timeIndex) => (
                                                                <tr key={timeIndex}>
                                                                    <td className="times-property-name">{timeKey}: </td>
                                                                    <td className="times-property-value">{decodeFromMorse(timeValue)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </React.Fragment>
                        ))}

                    </div>
                    <div className='other-infos'>
                        {/* Table for displaying the otherData */}
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th className='table-title'>Other System Informations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(otherData).map(([key, value], index) => (
                                    <tr key={index}>
                                        <td className="property-name">{value.property}</td>
                                        <td className="property-value">{value.decodedData}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className='update-button-container'>
                    <button className='update-button' onClick={fetchAllData}>update infos</button>
                </div>
            </>)}
        </>
    );
}

export default Arch;
