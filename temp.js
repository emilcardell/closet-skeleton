const bcrypt = require('bcrypt-nodejs');

const salt = bcrypt.genSaltSync(1000);
const passwordHash = bcrypt.hashSync('Meep', salt);

console.log(passwordHash);

bcrypt.compare('Meep', passwordHash, function(err, res) {
console.log(err);
console.log(res);

 });
