#!/usr/bin/env node
const fs = require('fs');
const path = require('path')
// Get all arguments but node path and script path
const args = process.argv.slice(2)
// Detect help paramters
if (args.includes('-h') || args.includes('--help')){
	printHelp()
	process.exit(0)
}
// get parameter's valve
function getParamValue(param) {
    const index = process.argv.indexOf(param)
    return index !== -1 ? process.argv[index + 1] : null
}
// get names of the input file and the output file
const inputFilePath = getParamValue('-if')
const outputFilePath = getParamValue('-of')
if(inputFilePath === null || outputFilePath === null) {
	console.error("Parameters error! If you need help, run this script with the -h or --help parameter.")
	process.exit(1)
}
// Check the existence and read status of the files for conformity with expectations
if (checkFiles(inputFilePath, outputFilePath)) {
	// Input file exists and output file does not exists
	const paths = checkFiles(inputFilePath, outputFilePath)
	const inputFilecontent = getFileContentAsString(paths[0])
	if (inputFilecontent === null) {
		process.exit(3)
	} else {
		// Final step: md -> html -> file
		makeHTML(inputFilecontent, paths[1])
	}
} else {
	// The file existence status is not as expected, exit
	process.exit(2)
}
// Check if input and out output files exists
function checkFiles(ifFile, ofFile) {
	// check if input file exists
	if (!fs.existsSync(ifFile)) {
        console.error(`Input file ${ifFile} does not exists.`)
        return false
    }
	// check if output file exists
    const ofFileExtension = path.extname(ofFile);
    let updatedOfFile = ofFile
    if (ofFileExtension !== '.html' && ofFileExtension !== '.htm') {
        updatedOfFile = `${ofFile}.html`;
    }
    if (fs.existsSync(updatedOfFile)) {
        console.error(`Output file ${updatedOfFile} is already exists.`)
        return false
    }
    return [ifFile, updatedOfFile]
}
// Print help infomation
function printHelp() {
	const filePath = __filename // Get current scipt's full path
    if (process.platform === 'win32') {
        parts = filePath.split('\\') // Case of Windows path separators
    } else {
        parts = filePath.split('/') // Other OSs.
    }
    const scriptName = parts[parts.length - 1]
    console.log('Help information:')
    console.log('Usage:')
    console.log(`  node ${scriptName} -if <input_file> -of <output_file>`)
    console.log('')
    console.log('Options:')
    console.log('  -h, --help     Display this help message')
    console.log('  -if <file>     Input file')
    console.log('  -of <file>     Output file')
    console.log('')
    console.log('Example:')
    console.log(`  node ${scriptName} -if input.md -of output.html`)
}
// Returns file content
function getFileContentAsString(inputFilePath) {
    try {
        const fileContentBuffer = fs.readFileSync(inputFilePath)
        const fileContentString = fileContentBuffer.toString()
        return fileContentString
    } catch (err) {
        console.error(`Cannot read file, information: ${err}`)
        return null
    }
}
// Makes markdown content to HTML, then write it to a file
function makeHTML(inputFilecontent, outputFilePath) {
	const escapedString = escapeString(inputFilecontent)
	const htmlContent = getHTMLByTemplate(escapedString)
	// Write HTML file
	try {
		fs.writeFileSync(outputFilePath, htmlContent);
		console.log(`HTML content has been successfully written to the ${outputFilePath}`);
	} catch (err) {
		console.error(`Error occurred when writing the file, information: ${err}`);
	}
}
// escape string
function escapeString(input) {
	// Escape using regular expressions
    return input.replace(/['"\\\n\r]/g, function(match) {
        // Replace matched characters with corresponding escape sequences
        switch(match) {
            case "'":
                return "\\'"
            case '"':
                return '\\"'
            case '\\':
                return '\\\\'
            case '\n':
                return '\\n'
            case '\r':
                return '\\r'
            default:
                return match
        }
    });
}
// Returns HTML template
function getHTMLByTemplate(input) {
	return '<script src=\"https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js\"></script>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css\">\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js\"></script>\n<div id=\"content\">*****PREVIEW_CONTENT_TO_REPLACE*****</div>\n<style>\n#content{color: #444;}\n</style>\n  <script>\n    var converter = new showdown.Converter({disableForced4SpacesIndentedSublists: true});\n    var text      = \'*****MARKDOWN_CONTENT_TO_REPLACE*****\';\n    var html      = converter.makeHtml(text);\n    document.getElementById(\'content\').setAttribute(\'style\', \'\')\n    document.getElementById(\'content\').innerHTML = html\n  </script>\n<script>hljs.highlightAll();</script>\n<style>\n  blockquote {\n  	margin: 0 8px;\n    display:flex;\n    flex-direction: row;\n    align-items: center;\n    position: relative;\n  }\n  blockquote:before {\n      background-color: #e0dede;\n      content: \'\';\n      position: absolute;\n      height: calc(100% - 2rem);\n      width: .30rem;\n      border-radius: 0.3rem;\n  }\n  blockquote > p {\n  	font-size: 1rem;\n    text-align: left;\n    margin-left: 0.8rem;\n    color: gray;\n  }\n  li>code,p>code{\n    background-color: #f3f3f3;\n    padding: 2px;\n    border-radius: 3px;\n  }\n  pre>code{\n  	font-size: 0.85rem;\n  }\n</style>\n'.replace("*****MARKDOWN_CONTENT_TO_REPLACE*****", input)
}