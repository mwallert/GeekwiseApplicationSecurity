const db = require('./db');

const TABLENAME = 'blogs';

class BlogDb {
    static getOne(id) {
        id = parseInt(id);
        let query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND id = ${id}`;
        return db.oneOrNone(query);
    }

    static getAll() {
        let query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false ORDER BY id DESC`;
        return db.any(query);
    }

    static updateOne(id, data) {
        id = parseInt(id);
        let params = [];
        Object.keys(data).forEach((key) => {
            params.push(`${key} = '${data[key]}'`);
        });
        let query = `UPDATE ${TABLENAME} SET ${params.join()} WHERE is_deleted=false AND id = ${id} RETURNING *`;
        return db.one(query);
    }

    static deleteOne(id) {
        id = parseInt(id);
        //let query = `DELETE FROM ${TABLENAME} WHERE id = ${id}`;
        let query = `UPDATE ${TABLENAME} SET is_deleted=true WHERE id = ${id}`
        return db.result(query, [], r => r.rowCount);
    }

    static insertOne(data) {
        let params = [];
        let values = [];
        Object.keys(data).forEach((key) => {
            params.push(key);
            values.push(`'${data[key]}'`);
        });
        let query = `INSERT into ${TABLENAME} (${params.join()}) VALUES(${values.join()}) RETURNING *`;
        return db.one(query);
    }

    static getTotal() {
        let query = `SELECT count(*) FROM ${TABLENAME}`;
        return db.one(query, [], a => +a.count);
    }
}

module.exports = BlogDb;