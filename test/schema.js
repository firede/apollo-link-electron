const { buildSchema } = require("graphql")

exports.schema = buildSchema(`
type Query {
  hello: String
}
`)

exports.rootValue = {
  hello() {
    return "world"
  },
}
