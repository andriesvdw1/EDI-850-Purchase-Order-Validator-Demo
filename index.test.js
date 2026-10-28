/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

describe('EDI 850 Purchase Order Validation Tests', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;

        // Extract and execute inline script so functions attach to window
        const scriptTag = document.querySelector('script');
        if (scriptTag) {
            window.eval(scriptTag.textContent);
        }

        window.docToCheck = document.getElementById("docToValidate");
    });

    test('1. Should FAIL when document is empty', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = '';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').textContent).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').textContent).toBe('Invalid');
    });

    test('2. Should FAIL when document does not start with ISA characters', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = 'GS*00*...';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').textContent).toBe('PASS');
        expect(document.getElementById('docHasISA').textContent).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').textContent).toBe('Invalid');
    });

    test('3. Should PASS when a valid fake EDI 850 document is provided', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = 'ISA*...GS*...ST*...BEG*...PO1*...SE*...GE*...IEA*';

        window.docValidate(textarea);

        expect(document.getElementById('docHasContentSpan').textContent).toBe('PASS');
        expect(document.getElementById('docHasISA').textContent).toBe('PASS');
        expect(document.getElementById('docHasSegmentTypes').textContent).toBe('PASS');
        expect(document.getElementById('docHasBEGPO1').textContent).toBe('PASS');
        expect(document.getElementById('FinalStatusDocumentSpan').textContent).toBe('Valid');
    });

    test('4. Should FAIL if BEG or PO1 segments are missing', () => {
        const textarea = document.getElementById('docToValidate');
        textarea.value = 'ISA*...GS*...ST*...BEG*...SE*...GE*...IEA*';

        window.docValidate(textarea);

        expect(document.getElementById('docHasBEGPO1').textContent).toBe('FAIL');
        expect(document.getElementById('FinalStatusDocumentSpan').textContent).toBe('Invalid');
    });
});