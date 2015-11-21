var fs = require('fs'),
    countries = require('country-data').countries,
    csv = require('csv'),
    transform = require('stream-transform');

var csv_directory = '../app/data/';

function countryToCC(country_name){
    if (country_name == "Global") {
        return "GLB";
    } else {
        for (var cc in countries) {
            if (cc == 'all') continue;
            //console.log(cc);
            if (countries[cc].name.toLowerCase() == country_name.toLowerCase()) {
                return countries[cc].alpha3;
            }
        }
    }
    console.log("DID NOT FIND " + country_name);
    return country_name;
}

function processCSV(filename, csv_parsed) {
    var columns = csv_parsed[0],
        country_col_idx = -1;
    columns.some(function(column) {
        country_col_idx += 1;
        return column == "Countries";
    });
    var countries = "";
    for (var i = 1; i < csv_parsed.length; i++) {
        country_codes = [];
        csv_parsed[i][country_col_idx].split(',').forEach(function(country){
            country = country.trim();
            country_codes.push(countryToCC(country));
        });
        csv_parsed[i][country_col_idx] = country_codes.join(",");
    }
    csv.stringify(csv_parsed, function(err, data){
        console.log(err);
        console.log(data);
        fs.writeFile(csv_directory + filename.replace('.csv', '-processed.csv'),
                     data, function(err){
            if (err) {
                return console.log(err);
            }
            console.log("Processed "+filename);
        });
    })
}

fs.readdir(csv_directory, function(err, files) {
    files.forEach(function(filename) {
        fs.readFile(csv_directory + filename, 'utf-8', function(err, data) {
            if (err) {
                console.log(err);
            }
            csv.parse(data, function(err, csv_parsed) {
                processCSV(filename, csv_parsed)
            })
        });
    });
});
