# nhentaidownloader

nhentaidownloader is a downloader for your favorite nHentai!
Only one parameter is required which is the ID

## Example
```js
const fs = require('fs');
const nhdl = require('nhentaidownloader');

var ID = "177013";

nhdl(ID).then(buffer => {
  fs.writeFileSync(`./${ID}.zip`, buffer);
});
```

## nhdl(ID)

This function take an nHentai ID and return with zip buffer promise
