import { ApolloLink, Observable, GraphQLRequest } from "apollo-link"
import { createGraphQLFetcher } from "electron-graphql"

export namespace ElectronLink {
  export interface Options {
    /**
     * The IPC channel basename, pair with electron-graphql's GraphQLExecutor.
     *
     * Defaults to 'electron-graphql'.
     */
    channel?: string

    /**
     * Passes the extensions field to your graphql server.
     *
     * Defaults to false.
     */
    includeExtensions?: boolean
  }
}

type MainProcessError = Error & { response: Record<string, any> }

export const createElectronLink = (linkOptions: ElectronLink.Options = {}) => {
  let { channel = "electron-graphql", includeExtensions } = linkOptions

  // init fetcher
  let fetcher = createGraphQLFetcher({ channel })
  fetcher.init()

  return new ApolloLink(
    operation =>
      new Observable(observer => {
        const { operationName, extensions, variables, query } = operation
        const body: Partial<GraphQLRequest> = { operationName, variables, query }

        if (includeExtensions) {
          body.extensions = extensions
        }

        fetcher
          .fetch(body)
          .then(response => {
            operation.setContext({ response })
            return response
          })
          .then(response => {
            if (!response.hasOwnProperty("data") && !response.hasOwnProperty("errors")) {
              const error = new Error(
                `Main process response was missing for query '${operationName}'`
              ) as MainProcessError
              error.response = response
            }

            return response
          })
          .then(result => {
            observer.next(result)
            observer.complete()
            return result
          })
          .catch(err => {
            observer.error(err)
          })
      })
  )
}

export class ElectronLink extends ApolloLink {
  constructor(opts?: ElectronLink.Options) {
    super(createElectronLink(opts).request)
  }
}
