const { ESLint } = require("eslint");
const fs = require('fs');
const lineByLine = require('n-readlines');
const prompt = require('prompt-sync')({sigint: true});

// Example Input: E:\snippets\test_reports\testCandidateJavascriptFiles.log
const logFileAbsolutePath = prompt("Log File Absolute Path: ");

// Example Input: E:\snippets\test_reports\test_javascript_snippets
const codeSnippetsAbsolutePath = prompt("Code Snippets Absolute Path: ");

async function buildPathsToCandidateCodeSnippets() {

    let candidateCodeSnippetPaths = [];

    try {
        const liner = new lineByLine(logFileAbsolutePath);
        let line;

        while (line = liner.next()) {
            candidateCodeSnippetPaths.push(codeSnippetsAbsolutePath + "\\" + line.toString().trim() + ".js");
        }
    } catch (error) {
        console.log("Error: " + error)
    }
    return candidateCodeSnippetPaths
}

(async function lintCandidateCodeSnippets() {

    let patterns = await buildPathsToCandidateCodeSnippets();

    console.log("Step 1 of 4. Creating an ESLint instance.")
    const eslint = new ESLint();

    console.log("Step 2 of 4. Linting candidate code snippets.")
    const results = await eslint.lintFiles(patterns);

    console.log("Step 3 of 4. Formatting the results.")
    const formatter = await eslint.loadFormatter("json");
    const resultText = await formatter.format(results);

    console.log("Step 4 of 4. Outputting the result to file.")
    const myCustomConsole = new console.Console(fs.createWriteStream('E:/snippets/test/reports/report.json'));
    myCustomConsole.log(resultText);

})().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});