const {MongoClient} = require('mongodb');


const url = "mongodb+srv://nick:rNm7QEGImg63pTI1@cluster0.aru2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var da

async function findSauce(da) { 
	

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("ingredients");

        let collection = db.collection('sauce');


        let res = await collection.find({}).toArray()
		console.log(res)
		return res;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}

console.log(findSauce(da))

