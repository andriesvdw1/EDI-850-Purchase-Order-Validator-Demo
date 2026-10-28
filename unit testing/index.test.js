/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML index file into JSDOM before running the tests
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

describe('EDI 850 Purchase Order Validation Tests', () => {
    beforeEach(() => {
        // Reset the DOM state before each test
        document.documentElement.innerHTML = html;

        // Extract and execute the inline script so validation functions are attached to window
        const scriptTag = document.querySelector('script');
        if (scriptTag) {
            window.eval(scriptTag.textContent);
        }

        // Re-assign global variables if needed by the script
        window.docToCheck = document.getElementById("docToValidate");
    });

    test('1. Should FAIL when document is empty', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = '';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').innerText).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').innerText).toBe('Invalid');
    });

    test('2. Should FAIL when document does not start with ISA characters', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = 'GS*00*...';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').innerText).toBe('PASS');
        expect(document.getElementById('docHasISA').innerText).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').innerText).toBe('Invalid');
    });

    test('3. Should PASS when a valid fake EDI 850 document is provided', () => {
        const textarea = document.getElementById('docToValidate');
        // Contains ISA, IEA, GS, ST, SE, BEG, and PO1
        textarea.value = 'ISA*...GS*...ST*...BEG*...PO1*...SE*...GE*...IEA*';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').innerText).toBe('PASS');
        expect(document.getElementById('docHasISA').innerText).toBe('PASS');
        expect(document.getElementById('docHasSegmentTypes').innerText).toBe('PASS');
        expect(document.getElementById('docHasBEGPO1').innerText).toBe('PASS');
        expect(document.getElementById('FinalStatusDocumentSpan').innerText).toBe('Valid');
    });

    test('4. Should FAIL if BEG or PO1 segments are missing', () => {
        const textarea = document.getElementById('docToValidate');
        // Missing PO1
        textarea.value = 'ISA*...GS*...ST*...BEG*...SE*...GE*...IEA*';

        window.docValidate(textarea);

        expect(document.getElementById('docHasBEGPO1').innerText).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').innerText).toBe('Invalid');
    });
});