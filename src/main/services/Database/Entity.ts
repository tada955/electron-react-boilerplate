// const dbmgr = require("./dbManager")
// const db = dbmgr.db
import { connect } from './DBManager';

export function readAllEntities() {
    try {
        const db = connect();

        const query = `SELECT * FROM entities`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()
        return rowList
    } catch (err) {
        console.error(err)
        throw err
    }
}

// module.exports = {
//   readAllEntities
// }