process.env.ORA_ADTZ='UTC';

const oracledb = require('oracledb');

const dbConfig = require('../other/dbconf.js');

module.exports.get = async function (req, res) {

	let sql0 = "SELECT id, parent_id FROM tab0 START WITH parent_id IS NULL CONNECT BY parent_id = PRIOR id ORDER SIBLINGS BY id", binds = {}, options, results, connection;

/*

From https://oracle-base.com/articles/misc/hierarchical-queries

DROP TABLE tab0 PURGE;

CREATE TABLE tab0 (

  id        NUMBER,

  parent_id NUMBER,

  CONSTRAINT tab0_pk PRIMARY KEY (id),

  CONSTRAINT tab0_tab0_fk FOREIGN KEY (parent_id) REFERENCES tab0(id)

);

CREATE INDEX tab0_parent_id_idx ON tab0(parent_id);

INSERT INTO tab0 VALUES (1, NULL);

INSERT INTO tab0 VALUES (2, 1);

INSERT INTO tab0 VALUES (3, 2);

INSERT INTO tab0 VALUES (4, 2);

INSERT INTO tab0 VALUES (5, 4);

INSERT INTO tab0 VALUES (6, 4);

INSERT INTO tab0 VALUES (7, 1);

INSERT INTO tab0 VALUES (8, 7);

INSERT INTO tab0 VALUES (9, 1);

INSERT INTO tab0 VALUES (10, 9);

INSERT INTO tab0 VALUES (11, 10);

INSERT INTO tab0 VALUES (12, 9);

INSERT INTO tab0 VALUES (13, NULL);

INSERT INTO tab0 VALUES (14, 13);

COMMIT;

* * * *

SELECT id,

       parent_id,

       RPAD('.', (level-1)*2, '.') || id AS tree,

       level,

       CONNECT_BY_ROOT id AS root_id,

       LTRIM(SYS_CONNECT_BY_PATH(id, '-'), '-') AS path,

       CONNECT_BY_ISLEAF AS leaf

FROM   tab1

START WITH parent_id IS NULL

CONNECT BY parent_id = PRIOR id

ORDER SIBLINGS BY id;

*/

try {

	//connection = await oracledb.getConnection(dbConfig);

	await oracledb.createPool(dbConfig);

	connection = await oracledb.getConnection();

	options = {

			outFormat: oracledb.OUT_FORMAT_OBJECT,

			extendedMetaData: false,

			prefetchRows: 1,

			fetchArraySize: 1

	};

	result = await connection.execute(sql0, binds, options);

// From https://stackoverflow.com/questions/49845748/convert-a-flat-json-file-to-tree-structure-in-javascript

	function getNestedChildren(arr, parent) {

		var out = []

		for(var i in arr) {

			if(arr[i].PARENT_ID == parent) {

				var children = getNestedChildren(arr, arr[i].ID)

				if(children.length) {

					arr[i].children = children

				}

				out.push(arr[i])

			}

		}

		return out

	}

	var nested = getNestedChildren(result.rows, null);

	var i = 0;

} catch (e) {

	console.error(e);

} finally {

	if (connection) {

		try {

			await connection.close();

		} catch (e) {

			console.error(e);

		} finally {

			await oracledb.getPool().close(10);

			res.send("<h1>Success</h1>");

		}

	}

}

}