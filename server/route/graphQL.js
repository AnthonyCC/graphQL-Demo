const graphqlHTTP = require('express-graphql');
const pubSub = require('../graphQL/subscription');
const usersService = require('../service/users');
const schema = require('../graphQL/schema');
const sub = require('../graphQL/subscription');

var fakeDatabase = {};
var root = {
    getUsers: function () {
        return usersService.findUsers({}).then((users) => {
            console.log(users);
            return users;
        });
    },
    findUsers: function ({userName}) {
        return usersService.findUsers({name: userName}).then((users) => {
            console.log(users);
            return users;
        });
    },
    addUser: function({userName, password}){
        return usersService.addUser(userName, password).then(user =>{
            if(user)
                sub.pubsub.publish('passwordUpdatedChannel', {passwordUpdated:user});
            return user;
        });
    },
    updateUserPassword: function ({userName, password}) {
        console.log(userName, password);
        return usersService.updateUser({name: userName}, {password: password}).then((response, data) => {
            console.log(response, data);
            return usersService.getUser({name: 'test1'}).then(user=> {
                // Publish subscription notification with the whole comment
                console.log(sub.pubsub);
                sub.pubsub.publish('passwordUpdatedChannel', {passwordUpdated:user});
                return user;
            });
        });
    },

    setMessage: function (obj) {
        fakeDatabase.message = obj.message;
        console.log(obj.message);
        return obj.message;
    },
    getMessage: function () {
        console.log(fakeDatabase.message);
        return fakeDatabase.message;
    },
    passwordUpdated: function(obj){

        console.log('passwordUpdated', obj);
    }
};

var graphHttp = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
});

module.exports = graphHttp;
