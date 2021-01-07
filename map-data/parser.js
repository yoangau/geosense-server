const fs = require('fs');
const _ = require("lodash")

const rawCountryData = fs.readFileSync("./populated-places-simple-50m.json")
const rawFlagsData = fs.readFileSync("./flag-emojis-by-code.json")

const countries = JSON.parse(rawCountryData).features
const flagsData = JSON.parse(rawFlagsData)

const countriesWithFlags = _.transform(countries, (acc, curr) => {
    const prop = curr.properties
    acc.push({
        city: prop.name,
        country: prop.adm0name,
        adminName: prop.adm1name,
        flag: flagsData[prop.iso_a2]?.emoji,
        isCapital: prop.adm0cap === 1,
        coordinates: curr.geometry.coordinates
    })
}, [])

fs.writeFileSync("../src/map/cities-flags.json", JSON.stringify(countriesWithFlags))

process.exit()