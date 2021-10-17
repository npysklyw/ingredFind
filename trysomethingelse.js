
const db = require('./tryingsomething');
let data = []

async function findSauce() { 
    
    db.find("sauces", {}, (err, res) => {
    if (err) console.log(err)
    console.log(res);
    data = await(res)
});

}
console.log(data)