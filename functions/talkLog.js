const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var fs = require('fs');
var path = require('path');

var absolutePath = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, "../../path.json")
    )
);

const talkCommandCounter = {
    score: 0,
    defaultScore: 0,
};

const autoSpeechCounter = {
    score: 0,
    defaultScore: 0,
};

async function output(nowtime) {
    const data = [{ time: Date(nowtime), command: talkCommandCounter.score, auto: autoSpeechCounter.score }];
    console.log(data);
    if (talkCommandCounter.score === 0 && autoSpeechCounter.score === 0) {
        return;
    }
    const csvWriter = createCsvWriter({
        path: absolutePath.talklog,
        header: ['time', 'command', 'auto'],
        append: true
    });
    await csvWriter.writeRecords(data).then(() => {
        console.log('done');
    });

    talkCommandCounter.score = talkCommandCounter.defaultScore;
    autoSpeechCounter.score = autoSpeechCounter.defaultScore;
    return;
}

function addAutoSpeechCounter() {
    autoSpeechCounter.score++;
    // console.log("add", autoSpeechCounter.score);
    return;
}

function addTalkCommandCounter() {
    talkCommandCounter.score++;
    // console.log("add", talkCommandCounter.score);
    return;
}

module.exports = {
    addAutoSpeechCounter,
    addTalkCommandCounter,
    output
}