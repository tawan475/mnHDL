const fs = require('fs');
const nhentaidl = require('nhentaidl');
var args = process.argv.slice(2);
if (!args[0] || args[0].match(/[^0-9]/g)) throw Error('First argrument must be number and valid nhentai ID.');

var ID = args[0];

nhentaidl(ID).then(buffer => {
  fs.writeFileSync(`./${ID}.zip`, buffer);
});