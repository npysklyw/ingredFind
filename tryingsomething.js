const MongoClient = require('mongodb').MongoClient;

module.exports.find = (collection, query, cb) => {
    let url = "mongodb+srv://nick:rNm7QEGImg63pTI1@cluster0.aru2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    MongoClient.connect(url, function (err, db) {
        if (err) cb(err);
        const dbo = db.db("ingredients");
        dbo.collection(collection).find(query).toArray(function (err, result) {
            db.close();
            if (err) cb(err);
            return cb(null, result);
        });
    });
}