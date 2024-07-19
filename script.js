// Define the button and display elements
const buttons = document.querySelectorAll('.btn');
const display = document.getElementById('display');

// Define basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return 'Cannot divide by zero';
    }
    return a / b;
}

// Variables to store the parts of a calculation
let firstNumber = '';
let operator = '';
let secondNumber = '';

// Function to perform an operation
function operate(firstNumber, operator, secondNumber) {
    let result;
    switch (operator) {
        case '+':
            result = add(parseFloat(firstNumber), parseFloat(secondNumber));
            break;
        case '-':
            result = subtract(parseFloat(firstNumber), parseFloat(secondNumber));
            break;
        case '*':
            result = multiply(parseFloat(firstNumber), parseFloat(secondNumber));
            break;
        case '/':
            result = divide(parseFloat(firstNumber), parseFloat(secondNumber));
            break;
        default:
            result = 'Invalid operator';
    }
    return Math.round(result * 100000) / 100000; // Round to 5 decimal places
}

// Variable to store the display value
let displayValue = '0';

// Function to update the display
function updateDisplay() {
    display.textContent = displayValue;
}

// Add event listeners to the buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value'); // Get the value of the button

        // Handle clear button
        if (value === 'C') {
            firstNumber = '';
            operator = '';
            secondNumber = '';
            displayValue = '0';
            updateDisplay();
            return;
        }

        // Handle backspace button
        if (value === '←') {
            if (displayValue.length > 1) {
                displayValue = displayValue.slice(0, -1);
            } else {
                displayValue = '0';
            }
            if (operator === '') {
                firstNumber = displayValue;
            } else {
                secondNumber = displayValue;
            }
            updateDisplay();
            return;
        }

        // Handle number and decimal buttons
        if (!isNaN(value) || value === '.') {
            if (value === '.' && displayValue.includes('.')) {
                return; // Prevent multiple decimals
            }
            if (operator === '') {
                // If there's no operator, update the first number
                if (displayValue === '0' || displayValue === 'Cannot divide by zero') {
                    displayValue = value;
                } else {
                    displayValue += value;
                }
                firstNumber = displayValue;
            } else {
                // If there's an operator, update the second number
                if (displayValue === firstNumber) {
                    displayValue = value;
                } else {
                    displayValue += value;
                }
                secondNumber = displayValue;
            }
            updateDisplay();
        } else if (value === '=') {
            // Handle equals button
            if (firstNumber !== '' && operator !== '' && secondNumber !== '') {
                displayValue = operate(firstNumber, operator, secondNumber).toString();
                firstNumber = displayValue;
                operator = '';
                secondNumber = '';
                updateDisplay();
            }
        } else {
            // Handle operator buttons
            if (firstNumber !== '') {
                if (operator !== '' && secondNumber !== '') {
                    // If there's an existing operator and second number, calculate the result first
                    firstNumber = operate(firstNumber, operator, secondNumber).toString();
                    displayValue = firstNumber;
                    secondNumber = '';
                    updateDisplay();
                }
                operator = value;
            }
        }
    });
});

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const button = document.querySelector(`.btn[data-value="${key}"]`);
    if (button) {
        button.click();
    } else if (key === 'Enter') {
        const equalsButton = document.querySelector('.btn[data-value="="]');
        equalsButton.click();
    } else if (key === 'Backspace') {
        const backspaceButton = document.querySelector('.btn[data-value="←"]');
        backspaceButton.click();
    } else if (key === 'Escape') {
        const clearButton = document.querySelector('.btn[data-value="C"]');
        clearButton.click();
    }
});
