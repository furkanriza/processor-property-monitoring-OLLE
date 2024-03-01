import React, { useState, useEffect } from 'react';
import './Style.css';

// Morse Code mapping for each alphabet letter and digit
const morseCodeMap = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.', '!': '-.-.--', '/': '-..-.',
    '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '..._.._', '@': '.--.-.'
};

// Function to decode Morse code to plain text
function decodeFromMorse(morseCode) {
    const inverseMorseCodeMap = Object.entries(morseCodeMap).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});

    return morseCode
        .split(' ')
        .map(code => inverseMorseCodeMap[code] || '')
        .join('');
}

function Cpu() {
    const [data, setData] = useState({
        checksum: '',
        data: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const apiData = JSON.parse(xhr.responseText);
                    setData(apiData);
                } else {
                    console.error('There was a problem with the AJAX request:', xhr.statusText);
                }
            }
        };

        xhr.open('POST', 'http://ik.olleco.net/morse-api/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            command: '-.-. .--. ..-'
        }));
    };

    return (
        <>
            <div className="home-content">
                <div className="processor-info">
                    <p>System Details</p>
                    
                    <table className="custom-table">
                        <tbody>
                            {data.data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="property-name">Model</td>
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
                                                            <td>{timeKey}: </td>
                                                            <td>{decodeFromMorse(timeValue)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={fetchData}>update</button>
                </div>
            </div>
        </>
    );
}

export default Cpu;
