const fs = require('fs');

// Online JSON Viewer: http://jsonviewer.stack.hu/

let esLintReport = null;

try {
    esLintReport = require("E:/snippets/test/reports/report.json");
} catch (e) {
    console.log("Error: " + e);
}

console.log("Step 1 of 4. Analysing rule violations...")
let ruleViolationDetailsMap = new Map();
// Loop through all snippet's rule violations.
for (let i = 0; i < esLintReport.length; i++) {

    const snippet = esLintReport[i];
    let ruleViolationDetails = snippet.messages;

    // Loop through all rule violations associated with each snippet.
    for (let i = 0; i < ruleViolationDetails.length; i++) {

        let ruleViolationType = (ruleViolationDetails[i].ruleId != null) ? ruleViolationDetails[i].ruleId : "uncategorised";
        let frequency = 1;

        if (!ruleViolationDetailsMap.has(ruleViolationType)) {
            ruleViolationDetailsMap.set(ruleViolationType, frequency);
        } else {
            frequency = ruleViolationDetailsMap.get(ruleViolationType);
            frequency++;
            ruleViolationDetailsMap.set(ruleViolationType, frequency);
        }
    }
}

console.log("Step 2 of 4. Sorting results...")
const sortedRuleViolationsMap = new Map([...ruleViolationDetailsMap.entries()].sort((a, b) => b[1] - a[1]));

console.log("Step 3 of 4. Building report analysis...")
let reportAnalysisContent = "";
reportAnalysisContent += "-------------------------------";
reportAnalysisContent += "\n";
reportAnalysisContent += "Rule Violation Type | Frequency";
reportAnalysisContent += "\n";
reportAnalysisContent += "-------------------------------"
reportAnalysisContent += "\n";

for (let [ruleViolationType, Frequency] of sortedRuleViolationsMap) {
    reportAnalysisContent += ruleViolationType + ': ' + Frequency;
    reportAnalysisContent += "\n";
}

reportAnalysisContent += "---------------------------------------"
reportAnalysisContent += "\n";
reportAnalysisContent += "Learn more about these rule violations:"
reportAnalysisContent += "\n";
reportAnalysisContent += "https://eslint.org/docs/rules/";
reportAnalysisContent += "\n";
reportAnalysisContent += "---------------------------------------"

console.log("Step 4 of 4. Outputting report analysis to file.")
const myCustomConsole = new console.Console(fs.createWriteStream('E:/snippets/test/reports/report_analysis.txt'));
myCustomConsole.log(reportAnalysisContent);