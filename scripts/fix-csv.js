var fs = require('fs'),
    countries = require('country-data').countries,
    csv = require('csv'),
    transform = require('stream-transform');

var csv_directory = 'app/data/';

var not_found = [];

// 'South Pacific': ''
// 'EU':
// 'Africa': ''
// 'the Baltic and the Middle East',

var country_mappings = {
    'South Korea': 'ROK',
    'Venezuela': 'VEN',
    'Vietnam': 'VNM',
    'Bosnia': 'BIH',
    'Russia': 'RUS',
    'Iran': 'IRN',
    'North Korea': 'PRK',
    'the Netherlands': 'NLD',
    'U.S.': 'USA',
    'UK': 'GBR',
    'Korea': 'ROK',
    'Macedonia': 'MKD',
    'UAE': 'ARE',
    'Palestine': 'PSE',
    'Bolivia': 'BOL',
    'Global (including Kenya)': "GLB",
    'The Philippines': 'PHL',
    'The Netherlands': 'NLD',
    'US': 'USA'
}

function countryToCC(country_name){
    if (country_name == "Global") {
        return "GLB";
    } else if (country_mappings[country_name] !== undefined) {
        return country_mappings[country_name];
    } else {
        for (var cc in countries) {
            if (cc == 'all') continue;
            if (countries[cc].name.toLowerCase() == country_name.toLowerCase()) {
                return countries[cc].alpha3;
            }
        }
    }
    if (not_found.indexOf(country_name) == -1) {
        not_found.push(country_name);
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
        csv_parsed[i][1] = csv_parsed[i][1].replace("freesnowden.is", "edwardsnowden.com");
        csv_parsed[i][country_col_idx] = country_codes.join(",");
    }
    csv.stringify(csv_parsed, function(err, data){
        fs.writeFile(csv_directory + filename.replace('.csv', '-processed.csv'),
                     data, function(err){
            if (err) {
                return console.log(err);
            }
            console.log("Processed "+filename);
            console.log(not_found);
        });
    })
}

fs.readdir(csv_directory, function(err, files) {
    files.forEach(function(filename) {
        if (filename.match("processed.csv$") === null) {
            fs.readFile(csv_directory + filename, 'utf-8', function(err, data) {
                if (err) {
                    console.log(err);
                }
                csv.parse(data, function(err, csv_parsed) {
                    processCSV(filename, csv_parsed)
                })
            });
        }
    });
});
