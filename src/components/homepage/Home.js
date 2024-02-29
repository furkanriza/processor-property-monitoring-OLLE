import React, { useState, useEffect } from 'react';
import './Style.css';
import Header from './Header';
import Footer from './Footer';

// Morse functions
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
        .map(code => inverseMorseCodeMap[code] || '') // Convert Morse to char, ignore if not found
        .join(''); // Join without spaces for decoded text
}

function Home() {
    const [data, setData] = useState({
        checksum: '',
        data: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('http://ik.olleco.net/morse-api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: '-.-. .--. ..-'
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(apiData => {
                setData(apiData);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    return (
        <>
            <Header />
            <div className="home-content">
                <table className="custom-table">
                    <tbody>
                        {/*<tr>
                            <td className="property-name">Checksum</td>
                            <td className="property-value">{decodeFromMorse(data.checksum)}</td>
    </tr>*/}
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
            </div>
            <Footer />
        </>
    );
}

export default Home;
