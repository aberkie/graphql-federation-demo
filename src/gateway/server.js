const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'pbs-kids-cms',
      url: 'http://localhost:4000',
    },
    {
      name: 'media-manager',
      url: 'http://localhost:4001',
    },
  ],
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
});

