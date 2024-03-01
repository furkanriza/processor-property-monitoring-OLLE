//this algorithm taken from https://github.com/cryptii/cryptii

// Morse Code mapping for each alphabet letter and digit
export const morseCodeMap = {
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
export function decodeFromMorse(morseCode) {
    const inverseMorseCodeMap = Object.entries(morseCodeMap).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});

    return morseCode
        .split(' ')
        .map(code => inverseMorseCodeMap[code] || '')
        .join('');
}
