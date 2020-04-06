# nhentaidl

nhentaidl is a downloader for your favorite nHentai!
Only one parameter is required which is the ID

## Example
```js
const fs = require('fs');
const nhentaidl = require('nhentaidl');

var ID = "177013";

nhentaidl(ID).then(buffer => {
  fs.writeFileSync(`./${ID}.zip`, buffer);
});
```

## nhentaidl(ID)

This function take an nHentai ID and return with zip buffer promise
