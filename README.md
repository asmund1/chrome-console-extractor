# chrome-console-extractor
Node.js program that connects to Chrome and logs developer console content to file (and screen).

# Dependencies

Uses [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) to extract from Chrome, so install that:

    npm install chrome-remote-interface

# Run

Start Chrome in with debug port 9222 open:

    chrome.exe --remote-debugging-port=9222

Then start program:
  
    chrome-console-extractor

Output will be written to file chrome.log, you can specify a different name using the `-o <yourfilename>` flag.
Use flag `-c true` to also print to screen/command line. 
