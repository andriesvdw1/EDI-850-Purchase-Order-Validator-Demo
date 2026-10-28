/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML index file into JSDOM before running the tests
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

describe('EDI 850 Purchase Order Validation Tests', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        // Reset the DOM state before each test
        document.documentElement.innerHTML = html;
        window = document.defaultView;

        // Re-assign global variables if needed by the script
        // docToValidate is the document content inside the text area on the form
        window.docToCheck = document.getElementById("docToValidate");
    });

    test('1. Should FAIL when document is empty', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = '';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').innerText).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').innerText).toBe('Invalid');
    });


})