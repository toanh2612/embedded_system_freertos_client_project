import CONFIG from '../config';
const r = require('rethinkdbdash')({
    host: CONFIG["RETHINKDB_HOST"],
    port: CONFIG["RETHINKDB_PORT"],
    db: CONFIG["RETHINKDB_DATABASE"],

});

export default {
  r
};

