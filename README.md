# [Server-Timing](https://w3c.github.io/server-timing/) response headers for Apollo Server

This Apollo Server plugin improves GraphQL observability characteristics by including resolver execution timing information in built-in browser dev tools. By leverage the Apollo-provided instrumentation from the tracing extension, we can augment response headers via this plugin to expose the timing to Dev Tools.

Caveat: This plugin has the potential to create large response headers; it's probably best to use as a development aid rather than indiscriminately in production.

## Quick start

### Install the dependency:

`npm i @jmandzik/apollo-server-plugin-server-timing`

### Register the plugin with your Apollo Server:

```javascript
const ServerTimingPlugin = require("@jmandzik/apollo-server-plugin-server-timing");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Tracing must be enabled for this plugin to add the headers
  tracing: true,
  // Register the plugin
  plugins: [ServerTimingPlugin]
});
```

## Timing visualization

### Chrome

![chrome](https://user-images.githubusercontent.com/885114/69303377-bd09a480-0bea-11ea-8e37-1cc84d0b47ce.png)

Just a heads up, Chrome truncates metric names after 22 characters. Deeply nested paths or long query/field names will be difficult to disambiguate.
![truncate](https://user-images.githubusercontent.com/885114/69304068-428e5400-0bed-11ea-9c80-4002e79163ac.png)

### Safari

Safari does a better job and doesn't truncate.
![safari](https://user-images.githubusercontent.com/885114/69303745-2342f700-0bec-11ea-8209-53b4945d3d6f.png)

## JS API

![js-api](https://user-images.githubusercontent.com/885114/69303503-4620db80-0beb-11ea-98fc-e6e61d2e37d0.png)

Some interesting use cases here might be to send a [Beacon](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) request and log slow queries.

### An example server can be run to see it in action:

```shell
git clone git@github.com:jmandzik/apollo-server-plugin-server-timing.git
cd apollo-server-plugin-server-timing
npm install
node example.js
```

Open up http://localhost:4000 and run the following query:

```graphql
{
  books {
    title
    author
  }
  fastBook: book(id: 1) {
    title
    author
  }
  slowBook: book(id: 2) {
    title
    author
  }
  someReallyLongNameThat: book(id: 2) {
    title
    author
  }
}
```
