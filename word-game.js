const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

let hiddenWord;
let validWord;
let inputWord = '';
let attempts = 6;
let row = 0;
let column = 0;

const rows = document.querySelectorAll(".box-row");

async function getWordOfTheDay() {
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    hiddenWord = processedResponse.word;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function putLetterInBox(letter) {
    if (inputWord.length < 5) {
        inputWord += letter;
        rows[row].children[column].innerText = letter;
        column++;
    }
    else {
        rows[row].lastElementChild.innerText = letter;
        inputWord = inputWord.substring(0, inputWord.length - 1) + letter;
    }
}

function clearLetter() {
    // useless
    // if (inputWord === '') {
    //     return;
    // }
    inputWord = inputWord.substring(0, inputWord.length - 1);
    rows[row].children[column-1].innerText = '';
    column--;
}

function changeBoxColor(color, index) {
    rows[row].children[index].style.borderColor = 'grey';
    switch (color) {
        case 'green':
            rows[row].children[index].style.backgroundColor = 'green';
            break;
        case 'orange':
            rows[row].children[index].style.backgroundColor = 'orange';
            break;
        case 'grey':
            rows[row].children[index].style.backgroundColor = 'grey';
            break;
        case 'red':
            Array.from(rows[row].children).forEach(box => {
                box.style.transition = 'border-color 2s';
                box.style.borderColor = 'red';
            });
            setTimeout(() => {
                Array.from(rows[row].children).forEach(box => {
                    box.style.borderColor = '';
                });
            }, 1000);
            break;
    }
}

function checkGuessedLetters() {
    let wordToCheck = hiddenWord;
    for (let i = 0; i < 5; i++) {
        let checkingLetter = inputWord[i].toLowerCase();
        console.log(checkingLetter);
        if (wordToCheck.includes(checkingLetter)) {
            if (wordToCheck.indexOf(checkingLetter) === i) {
                console.log('green');
                wordToCheck = wordToCheck.replace(checkingLetter, ' ');
                console.log(wordToCheck);
                changeBoxColor('green', i);
            }
            else {
                wordToCheck = wordToCheck.replace(checkingLetter, ' ');
                changeBoxColor('orange', i);
            }
        }
        else {
            changeBoxColor('grey', i);
        }
    }
    row++;
    column = 0;
    inputWord = '';
    attempts--;
}

async function isWord(inputWord) {
    const isWord_URL = "https://words.dev-apis.com/validate-word";
    const postData = {
        word: inputWord
    };
    const response = await fetch(isWord_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    });
    const data = await response.json();
    validWord = data.validWord;
}

async function checkInputWord() {
    await isWord(inputWord);
    if (inputWord.length !== 5) {
        return;
    }
    else if (inputWord === hiddenWord) {
        checkGuessedLetters();
        alert('You won');
        attempts = 0;
    }
    else if (validWord) {
        checkGuessedLetters();
    }
    else {
        changeBoxColor('red', 0);
    }
}

function init() {       
    document.addEventListener("keyup", function (event) {
        if (!isLetter(event.key)) {
            if (event.key === 'Enter' && attempts > 0) {
                console.log(inputWord);
                checkInputWord();
            }
            else if (event.key === 'Backspace') {
                clearLetter();
            }
            else {
                event.preventDefault();
            }
        }
        else if (attempts > 0) {
            putLetterInBox(event.key);
        }
        else {
            event.preventDefault();
        }
    }); 
}

init();
getWordOfTheDay();


  