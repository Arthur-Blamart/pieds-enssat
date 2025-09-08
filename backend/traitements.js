const fs = require('fs');
const path = require('path');

function getAllFeet() {
    const jsonPath = path.join(__dirname, './pieds/pieds.json');
    const data = fs.readFileSync(jsonPath, 'utf-8');
    const pieds = JSON.parse(data);
    return pieds.pieds;
}

function getRandomFeet() {
    const allFeet = getAllFeet();
    return allFeet[Math.floor(Math.random() * allFeet.length)];
}

module.exports = {
    getAllFeet,
    getRandomFeet
};