import * as fs from 'fs'
import * as path from 'path'
const packageJson = require('../../package.json')

export const microCredits = (port: number = null) => {

    const credits = fs.readFileSync(path.resolve(__dirname, '../..', 'credits.txt'), 'utf8')
    .split('\n')
    .forEach(_line => {
        console.log('\x1b[34m%s\x1b[0m', _line.replace(/\[VERSION]/g, packageJson.version))
    })
    console.log('')

    if (port) console.log('\x1b[33m%s\x1b[0m', 'microdose is listening on port ' + port)
}
