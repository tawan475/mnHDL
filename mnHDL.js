const fs = require('fs');
const requestretry = require('requestretry')
const archiver = require("archiver");
const thread = 20;

module.exports = function (path, ID) {
    return new Promise(async (Resolve, Reject) => {
        var queue = [];
        var rawurl = "https://nhentai.net/api/gallery/" + ID;

        var output = fs.createWriteStream(`${path}`);
        var zip = archiver('zip');
        zip.pipe(output);
        zip.on('error', e => console.log('zip error: ', e.message));

        var rawjson = await request(rawurl);
        var json = JSON.parse(rawjson);
        if (json.error) throw Error('Error! ID not found.');
        for (let i = 1; i < json.images.pages.length + 1; i++) {
            var data = json.images.pages[i - 1];
            let extension;
            if (data.t === "j") extension = 'jpg'
            if (data.t === "p") extension = 'png'
            if (data.t === "g") extension = 'gif'
            queue.push({
                url: `https://i.nhentai.net/galleries/${json.media_id}/${i}.${extension}`,
                id: i,
                extension: extension
            });
        };
        await downloadQueue(queue).then(() => {
            console.log('done')
            Resolve()
        });

        async function downloadQueue(queue) {
            return new Promise(async (resolve, reject) => {
                if (queue.length === 0) {
                    console.log('done')
                    zip.finalize()
                    return resolve();
                }
                const subq = queue.splice(0, thread)
                var promises = []
                for (let i = 0; i < subq.length; i++) {
                    promises.push(new Promise(async (resolve, reject) => {
                        var image = await request(subq[i].url);
                        await zip.append(Buffer.from(image, "binary"), { name: `${subq[i].id}.${subq[i].extension}` })
                        resolve()
                    }));
                }
                await Promise.all(promises)
                setImmediate(downloadQueue, queue);
            })
        };

        function request(url) {
            return new Promise((resolve, reject) => {
                requestretry({
                    url: url,
                    maxAttempts: 20,
                    retryDelay: 250,
                    retrySrategy: requestretry.RetryStrategies.HTTPOrNetworkError,
                    encoding: "binary"
                }, function (err, response, body) {
                    if (err) console.error(err)
                    if (response) {
                        resolve(body)
                    }
                })
            })
        };
    })
}