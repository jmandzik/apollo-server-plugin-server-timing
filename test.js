const plugin = require("./index");
const expected = `books;dur=0.44,books.0.title;dur=0.10,books.0.author;dur=1.09,books.1.title;dur=0.04,books.1.author;dur=103.30,fastBook;dur=0.09,fastBook.title;dur=0.02,fastBook.author;dur=0.12,slowBook;dur=0.01,slowBook.title;dur=0.01,slowBook.author;dur=102.75`;
let actual;

const fakeRequestContext = {
  response: {
    http: {
      headers: {
        set: (key, val) => {
          actual = val;
        }
      }
    },
    extensions: {
      tracing: {
        execution: {
          resolvers: [
            {
              path: ["books"],
              parentType: "Query",
              fieldName: "books",
              returnType: "[Book]",
              startOffset: 3088087,
              duration: 439759
            },
            {
              path: ["books", 0, "title"],
              parentType: "Book",
              fieldName: "title",
              returnType: "String",
              startOffset: 3593180,
              duration: 103043
            },
            {
              path: ["books", 0, "author"],
              parentType: "Book",
              fieldName: "author",
              returnType: "String",
              startOffset: 3711758,
              duration: 1094098
            },
            {
              path: ["books", 1, "title"],
              parentType: "Book",
              fieldName: "title",
              returnType: "String",
              startOffset: 4130588,
              duration: 40394
            },
            {
              path: ["books", 1, "author"],
              parentType: "Book",
              fieldName: "author",
              returnType: "String",
              startOffset: 4181337,
              duration: 103299472
            },
            {
              path: ["fastBook"],
              parentType: "Query",
              fieldName: "book",
              returnType: "Book!",
              startOffset: 4550791,
              duration: 88075
            },
            {
              path: ["fastBook", "title"],
              parentType: "Book",
              fieldName: "title",
              returnType: "String",
              startOffset: 4668549,
              duration: 15104
            },
            {
              path: ["fastBook", "author"],
              parentType: "Book",
              fieldName: "author",
              returnType: "String",
              startOffset: 4692053,
              duration: 119904
            },
            {
              path: ["slowBook"],
              parentType: "Query",
              fieldName: "book",
              returnType: "Book!",
              startOffset: 4714402,
              duration: 9942
            },
            {
              path: ["slowBook", "title"],
              parentType: "Book",
              fieldName: "title",
              returnType: "String",
              startOffset: 4736883,
              duration: 6388
            },
            {
              path: ["slowBook", "author"],
              parentType: "Book",
              fieldName: "author",
              returnType: "String",
              startOffset: 4749461,
              duration: 102748855
            }
          ]
        }
      }
    }
  }
};

plugin.requestDidStart().willSendResponse(fakeRequestContext);

console.assert(
  expected === actual,
  `Expected: "${expected}", but received: "${actual}"`
);
