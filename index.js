const inquirer = require('inquirer');
const fs = require("fs-extra");

const fileGenerator = require("./src/fileGenerator.js");

const {
    initialQuestions,
    engineerQuestions,
    internQuestions
} = require("./src/anyQuestions.js");

const Manager = require("./lib/manager");
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");

const managerArray = [];
const engineerArray = [];
const internArray = [];

function initiate() {
    inquirer
        .prompt(initialQuestions)
        .then(res => {
            let data = new Manager(res.name, res.id, res.email, res.generic);
            managerArray.push(data);

            const title = res.title;

            if (res.choice === "Add A New Engineer") {
                return engineerHere(title);
            } else if (res.choice === "Add A New Intern") {
                return internHere(title);
            } else if (res.choice === "Finish And Generate Files") {
                writeToFile(title);
                return;
            }
        })
}

async function engineerHere(title) {
    inquirer
        .prompt(engineerQuestions)
        .then(res => {
            let data = new Engineer(res.name, res.id, res.email, res.generic);
            engineerArray.push(data);

            if (res.choice === "Add A New Engineer") {
                return engineerHere(title);
            } else if (res.choice === "Add A New Intern") {
                return internHere(title);
            } else if (res.choice === "Finish And Generate Files") {
                writeToFile(title);
                return;
            }
        })
}

async function internHere(title) {
    inquirer
        .prompt(internQuestions)
        .then(res => {
            let data = new Intern(res.name, res.id, res.email, res.generic);
            internArray.push(data);

            if (res.choice === "Add A New Engineer") {
                return engineerHere(title);
            } else if (res.choice === "Add A New Intern") {
                return internHere(title);
            } else if (res.choice === "Finish And Generate Files") {
                writeToFile(title);
                return;
            }
        })
}

async function writeToFile(fileName) {
    console.log(fileName);
    const projectName = `${fileName}`
    const filePath = `./dist/`;
    const projectMD = `./${filePath}${projectName}.html`
    
    const data = fileGenerator(fileName, managerArray, engineerArray, internArray);

    await fs.ensureDir(filePath, error => {
        if (error) {
            console.log(error);
        }
    });

    await fs.outputFile(projectMD, data, (error) => {
        if (error) {
            console.log(error);
        }
    });
}

initiate();