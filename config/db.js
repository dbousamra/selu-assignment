module.exports = {
 db: {
   production: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb',
   development: "mongodb://localhost/selu-assignment-dev",
   test: "mongodb://localhost/selu-assignment-test",
 }
};