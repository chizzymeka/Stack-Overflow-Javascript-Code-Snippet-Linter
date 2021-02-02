const { ESLint } = require("eslint");
const fs = require('fs');
const lineByLine = require('n-readlines');
const prompt = require('prompt-sync')({sigint: true});

/*
    Example Input:
    Test: E:\snippets\test\testCandidateJavascriptFiles.log
    Main Work: E:\snippets\javascript\javascript\snips_sym_kw_6lines_id
 */
const logFileAbsolutePath = prompt("Log File Absolute Path: ");

/*
    Example Input:
    Test: E:\snippets\test\test_javascript_snippets\
    Main Work: E:\snippets\javascript\javascript\SnippetsOutput-0\Lot-1
 */
const codeSnippetsAbsolutePath = prompt("Code Snippets Absolute Path: ");

let candidateCodeSnippetFilenames = [];

try {
    const liner = new lineByLine(logFileAbsolutePath);
    let line;

    while (line = liner.next()) {
        candidateCodeSnippetFilenames.push(line.toString().trim() + ".js");
    }
} catch (error) {
    console.log("Error: " + error)
}

const eslint = new ESLint(); // Create an ESLint instance.
let counter = 0;
const directoryPathPrefix = "E:/snippets/javascript/javascript/reports/";
let filenameAndExtension = [];
let filenameWithoutExtension = null;

fs.opendir(codeSnippetsAbsolutePath, (err, dir) => {

    if (err) {
        console.error(err)
        return
    }

    const readNext = (dir) => {

        let containingFolder = dir.path.split("SnippetsOutput-0\\")[1];

        dir.read(async (err, file) => {
            if (err) {
                // log and return error
                console.error(err)
                return
            }

            if (file === null) {
                console.log("Job Completed!");
                return
            }

            if (candidateCodeSnippetFilenames.includes(file.name)) {

                process.stdout.write("Now processing number " + ++counter + "\r");

                // Lint file.
                const result = await eslint.lintFiles([dir.path + "\\" + file.name]);

                // Format the result.
                const formatter = await eslint.loadFormatter("json");
                let resultText = formatter.format(result);

                // Create directory if it does not exist.
                let fullDirectoryPath = directoryPathPrefix + containingFolder;
                if (!fs.existsSync(fullDirectoryPath)) {
                    fs.mkdirSync(fullDirectoryPath);
                }

                // Output to file.
                filenameAndExtension = file.name.split(".");
                filenameWithoutExtension = filenameAndExtension[0]
                fs.appendFileSync(fullDirectoryPath + "/" + filenameWithoutExtension + ".json", resultText);
            }
            readNext(dir)
        })
    }
    readNext(dir)
})