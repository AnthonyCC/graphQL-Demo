const sub = require('graphql-subscriptions');
const schema = require('./schema');

const pubsub = new sub.PubSub();
const manager = new sub.SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: {
        passwordUpdated: (options, args) => ({
            passwordUpdatedChannel: {
               filter: user => user!=null
            },
        }),
    },
    // setupFunctions: {
    //     passwordUpdated: (options, filer, name) => {
    //         console.log('setupFunctions: passwordUpdated');
    //         return {
    //             passwordUpdated: {
    //                 filter: user => {
    //                     console.log('user: ', user);
    //                     return user;
    //                 }
    //             }
    //         };
    //
    //
    //     },
    // },

});
// start a subscription
manager.subscribe({
    query: `
    
    subscription passwordUpdated{passwordUpdated{name password}}
  
  `,
    context: {},
    callback: (err, data) => console.log(data),
});
module.exports = {
    pubsub,
    manager
};
