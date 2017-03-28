const express = require('express');
const graphQL = require('./route/graphQL');
const http = require('http');
const app = express();
const cors = require('cors');

app.use(express.static('app'));

const subsWS = require('subscriptions-transport-ws');
const sub = require('./graphQL/subscription');

const subscriptionManager = sub.manager;
var count = 0;
// const schema = new graphql.GraphQLSchema(
//     {
//         query: new graphql.GraphQLObjectType({
//             name: 'RootQueryType',
//             fields: {
//                 count: {
//                     type: graphql.GraphQLInt,
//                     resolve: function () {
//                         return count;
//                     }
//                 }
//             }
//         }),
//         mutation: new graphql.GraphQLObjectType({
//             name: 'RootMutationType',
//             fields: {
//                 updateCount: {
//                     type: graphql.GraphQLInt,
//                     description: 'Updates the count',
//                     resolve: function () {
//                         count += 1;
//                         return count;
//                     }
//                 }
//             }
//         })
//     });
app.use(function (req, res, next) {
    setTimeout((function () {
        next();
    }), 1000);
});

app.use(cors());

app.use('/graphql', graphQL);

console.log('Running...');

// const httpServer = http.createServer((request, response) => {
//     response.writeHead(404);
//     response.end();
// });
// httpServer.listen(4001, () => console.log(
//     `Websocket Server is now running on http://localhost:4001`
// ));
// const subscriptionServer = new subsWS.SubscriptionServer(
//     {
//         subscriptionManager: subscriptionManager,
//         // onConnect: (connectionParams) => {
//         //     console.log('sub client connected:', connectionParams);
//         // }
//     }
//     ,
//     {
//         server: httpServer,
//         path: '/subscriptions',
//     }
// );


// Bind it to port and start listening
var subscriptionServer = http.createServer(app);
new subsWS.SubscriptionServer({
    subscriptionManager: subscriptionManager,
    onConnect: (connectionParams) => {
        console.log('sub client connected:', connectionParams);
    }
}, {
    server: subscriptionServer,
    path: '/subscriptions',
});
subscriptionServer.listen(4000);

// const subscriptionManager = new SubscriptionServer(
//     {
//         onConnect: async (connectionParams) => {
//             // Implement if you need to handle and manage connection
//         },
//         subscriptionManager: subscriptionManager
//     },
//     {
//         server: websocketServer,
//         path: '/'
//     }
// );
module.exports = app;