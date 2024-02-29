import React, { useState } from 'react';

function Morse() {

    /*morse functions*/
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

    // Function to encode plain text to Morse code
    function encodeToMorse(text) {
        return text
            .toLowerCase()
            .split('')
            .map(char => morseCodeMap[char] || '') // Convert char to Morse, ignore if not found
            .filter(code => code) // Remove entries for which Morse code is not defined
            .join(' '); // Join with spaces
    }

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

    // Example usage:
    const encoded = encodeToMorse('hello world');
    const decoded = decodeFromMorse(encoded);

    console.log('Encoded:', encoded);
    console.log('Decoded:', decoded);

    /* morse functions end */


    const [inputText, setInputText] = useState('');
    const [morseCode, setMorseCode] = useState('');
    const [decodedText, setDecodedText] = useState('');

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleMorseChange = (event) => {
        setMorseCode(event.target.value);
    };

    const encodeText = () => {
        const encoded = encodeToMorse(inputText);
        setMorseCode(encoded);
    };

    const decodeMorse = () => {
        const decoded = decodeFromMorse(morseCode);
        setDecodedText(decoded);
    };

    return (
        <div className="App">
            <header className="App-header">
                <p>Edit <code>src/App.js</code> and save to reload.</p>
                <div>
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleTextChange}
                        placeholder="Enter text to encode"
                    />
                    <button onClick={encodeText}>Encode to Morse</button>
                </div>
                <p>Encoded Morse Code: {morseCode}</p>
                <div>
                    <input
                        type="text"
                        value={morseCode}
                        onChange={handleMorseChange}
                        placeholder="Enter Morse code to decode"
                    />
                    <button onClick={decodeMorse}>Decode Morse to Text</button>
                </div>
                <p>Decoded Text: {decodedText}</p>
            </header>
        </div>
    );
}

export default Morse;
