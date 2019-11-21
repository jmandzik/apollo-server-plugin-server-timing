const { ApolloServer, gql } = require("apollo-server");
const ServerTimingPlugin = require("./index");

const simulateLongRunningQuery = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

const books = [
  {
    id: "1",
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    id: "2",
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    book(id: ID!): Book!
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (_, args) => books.find(book => book.id === args.id)
  },
  Book: {
    author: async ({ id, author }) => {
      if (id === "2") {
        await simulateLongRunningQuery();
      }
      return author;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  plugins: [ServerTimingPlugin]
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
