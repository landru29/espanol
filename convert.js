const path = require('path');
const fs = require('fs');


//passsing directoryPath and callback function
filenames = fs.readdirSync(__dirname);

const allEntries = filenames
    .filter((file) => !fs.lstatSync(file).isDirectory() && file.match(/\.csv$/i))
    .map((file) => {
        const data = fs.readFileSync(file, {encoding:'utf8', flag:'r'});
        return data.split("\n").map((line) => {
            const words = line.split(",");

            if (words.length>1) {
                return {
                    fr: words[0].trim().toLocaleLowerCase(),
                    es: words[1].trim().toLocaleLowerCase(),
                };
            }

            return null;
        });
    })
    .filter((elt) => elt)
    .reduce((total, current) => {
        return [...total, ...current]
    }, []);

fs.writeFileSync('public/vocabulary.json', JSON.stringify(allEntries));