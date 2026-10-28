# EDI-850-Purchase-Order-Validator-Demo
Check if a valid EDI purchase order was pasted into a text area on a website. Show the user the reason if it is invalid. Show "valid document" on success.

## Scope of project
Take as input a ANSI X12 EDI 850 purchase order Version 004010 text document.
Validate that the document is valid and show an appropriate error if the document is invalid.
Show a message that the document is valid.

## Out of scope
All other document types and versions as this is just a demonstration of a document validation program on the web.

## Tech Stack Chosen
JavaScript code with HTML5 and CSS3 to enable the frontend to execute in a browser and be available online.

## Step by step program execution
1) A document or text file is pasted into a text area by the user.
2) The user clicks on a "Validate" button.
3) The program script will do the following checks based on document content and structure:
4) Does the document have content or is it empty?
5) Does the document or text start with the characters "ISA"?
6) Every segment type (ISA, GS, ST, BEG, etc.) has an acceptable number of elements as defined by the X12 standard.
7) Check that the segments appear in the document or text in the order: ISA -> IEA -> GS ->GE ST-> SE.
8) Check which element separator is used. Store the character directly following "ISA" as the delimiter.
9) Specific check for the 850 document: A BEG and one or more P01 item/s are present.


## Working on:
10) Identify the segment terminator which should be at the end of every line. Will check the last character of the document provided.
11) Check the length of the ISA segment to match exactly to 106 characters in length with the segment terminator included.
12) Split the file on the segment terminator and then split each segment on the element separator.
13) Validate every control number pairing: ISA13 should equal IEA02. GS06 should equal GE02. ST02 should equal SE02. Any mismatch means a corrupted, invalid or user-edited file to reject.
14) Validate the segment and group counts: e.g. Se01 equals the exact number of segments from ST through SE inclusive.


# The initial purchase order document content for testing the program:
```
ISA*00*          *00*          *ZZ*ABC_AEROSPACE  *ZZ*XYZ_AIRCRAFT   *000506*1234*U*00401*000000001*0*P*>~
GS*PO*ABC_AEROSPACE*XYZ_AIRCRAFT*20000506*1234*1*X*004010~
ST*850*0001~
BEG*00*NE*508517**20000506~
ITD*05******30********Net 30~
DTM*002*20000506~
N1*BY*ABC Aerospace Corporation*9*123456789-0101~
N3*1000 Boardwalk Drive~
N4*Somewhere*CA*98898~
N1*ST*XYZ Aircraft Parts~
PO1*1*48*EA*3**BP*R5656-2~
IT8*1*D~
CTT*1~
SE*12*0001~
GE*1*1~
IEA*1*000000001~
```