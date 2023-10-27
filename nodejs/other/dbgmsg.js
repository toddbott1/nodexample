module.exports.log = (msg) => {

	if (process.env.DBGMSG==="ON") {

		console.log(msg);

	}

};