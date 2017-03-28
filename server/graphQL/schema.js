const graphql = require('graphql');

var schema = graphql.buildSchema(`
    type Subscription {
      passwordUpdated: User
    }
    type Mutation {
      setMessage(message: String): String,
      updateUserPassword(userName: String, password: String): User
      addUser(userName: String, password: String): User
    }
    
    type Query {
      getMessage: String,
      getUsers: [User],
      findUsers(userName: String): [User]
    }
    
    type User {
        name: String,
        password: String
    }
`);

module.exports =  schema;
