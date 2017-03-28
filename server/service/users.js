const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
// var restaurants = mongoose.model('restaurant', new mongoose.Schema({
//     borough: String,
//     cuisine: String
// }), 'restaurants');

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});

const users = mongoose.model('testuser', userSchema, 'testUsers');

let findUsers = function (query) {
    return users.find(query).exec();
};
let getUser = function (query) {
    return users.findOne(query).exec();
};
let updateUser = function(query, updateQuery){
    return users.update(query, updateQuery).exec();
};
let addUser = function(userName, password){
    return getUser({name: userName}).then(user => {
        if(user == null){
            var newUser = new users({name: userName, password});
            return newUser.save();
        }else{
            return null;
        }
    });
};
module.exports = {
    findUsers,
    getUser,
    updateUser,
    addUser
};
