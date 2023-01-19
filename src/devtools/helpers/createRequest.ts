const url = "https://zaiste.staging.saleor.cloud/graphql/"

export const createRequest = ({
  request,
  response,
}: {
  request: Array<{
    query: string
    variables: object
  }>
  response: object
}) => ({
  time: 1099.4580000406131,
  request: {
    url,
    headers: [
      {
        name: "Authorization",
        value: "Bearer fe0e8768-3b2f-4f63-983d-1a74c26dde1e",
      },
    ],
    postData: {
      text: JSON.stringify(
        request.map(({ query, variables }) => ({
          query,
          variables,
        }))
      ),
    },
    headersSize: 698,
    bodySize: 578,
  },
  response: {
    status: 200,
    headers: [
      {
        name: "cookie",
        value:
          "CONSENT=YES+GB.en+20151113-21-1; ANID=fe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1efe0e8768-3b2f-4f63-983d-1a74c26dde1e",
      },
    ],
    headersSize: 589,
    bodySize: 3364,
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  getContent: (cb: Function) => {
    cb(JSON.stringify(response))
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _mockRequests = [
  createRequest({
    request: [
      {
        query: `
          fragment NameParts on Person {
            firstName
            lastName
          }

          query getMovieQuery($title: String) {
            getMovie(title: $title) {
              id
              title
              genre
            }
          }
        `,
        variables: {
          title: "Batman",
        },
      },
    ],
    response: {
      data: {
        getMovie: {
          id: "1",
          title: "Batman",
          genre: "Action",
        },
      },
    },
  }),
  createRequest({
    request: [
      {
        query: `
          query searchMovieQuery($title: String) {
            searchMovie(title: $title) {
              id
              title
              genre
            }
          }
        `,
        variables: {
          title: "Batman",
        },
      },
    ],
    response: {
      data: {
        searchMovie: [
          {
            id: "1",
            title: "Batman",
            genre: "Action",
          },
          {
            id: "2",
            title: "American Psycho",
            genre: "Thriller",
          },
          {
            id: "3",
            title: "The Godfather",
            genre: "Drama",
          },
        ],
      },
    },
  }),
  createRequest({
    request: [
      {
        query: `
          mutation createMovieMutation($title: String, $genre: String) {
            createMovie(title: $title, genre: $genre) {
              id
              title
              genre
            }
          }
        `,
        variables: {
          title: "Batman",
        },
      },
    ],
    response: {
      data: {
        createMovie: {
          id: "4",
          title: "Batman Again",
          genre: "Action",
        },
      },
      extensions: {
        tracing: {
          version: 1,
          startTime: "2021-01-01T00:00:00.000Z",
          endTime: "2021-01-01T00:00:00.100Z",
          duration: 100 * 1000000,
          execution: {
            resolvers: [
              {
                path: ["createMovie"],
                parentType: "Mutation",
                fieldName: "createMovie",
                returnType: "Movie",
                startOffset: 10 * 1000000,
                duration: 5 * 1000000,
              },
              {
                path: ["createMovie", "id"],
                parentType: "Movie",
                fieldName: "id",
                returnType: "ID!",
                startOffset: 15 * 1000000,
                duration: 15 * 1000000,
              },
              {
                path: ["createMovie", "title"],
                parentType: "Movie",
                fieldName: "title",
                returnType: "String",
                startOffset: 15 * 1000000,
                duration: 75 * 1000000,
              },
              {
                path: ["createMovie", "genre"],
                parentType: "Movie",
                fieldName: "genre",
                returnType: "String",
                startOffset: 15 * 1000000,
                duration: 80 * 1000000,
              },
            ],
          },
        },
      },
    },
  }),
  createRequest({
    request: [
      {
        query: `
          query {
            listActors {
              id
              name
            }
          }
        `,
        variables: {},
      },
      {
        query: `
          query {
            listCategories {
              id
              title
            }
          }
        `,
        variables: {},
      },
    ],
    response: {
      data: {
        listActors: [
          {
            id: "1",
            name: "Tom Hanks",
          },
          {
            id: "2",
            name: "Robert De Niro",
          },
          {
            id: "3",
            name: "Brad Pitt",
          },
        ],
        listCategories: [
          {
            id: "1",
            name: "Action",
          },
          {
            id: "2",
            name: "Horror",
          },
        ],
      },
      extensions: {
        tracing: {
          version: 1,
          startTime: "2021-01-01T00:00:00.000Z",
          endTime: "2021-01-01T00:00:00.100Z",
          duration: 100 * 1000000,
          execution: {
            resolvers: [
              {
                path: ["listActors"],
                parentType: "Query",
                fieldName: "listActors",
                returnType: "Actor",
                startOffset: 10 * 1000000,
                duration: 88 * 1000000,
              },
              {
                path: ["listCategories"],
                parentType: "Query",
                fieldName: "listCategories",
                returnType: "Category",
                startOffset: 10 * 1000000,
                duration: 75 * 1000000,
              },
              {
                path: ["listCategories", 0, "id"],
                parentType: "Category",
                fieldName: "id",
                returnType: "ID!",
                startOffset: 85 * 1000000,
                duration: 1 * 10000,
              },
              {
                path: ["listCategories", 0, "name"],
                parentType: "Category",
                fieldName: "name",
                returnType: "String",
                startOffset: 85 * 1000000,
                duration: 1 * 10000,
              },
              {
                path: ["listCategories", 1, "id"],
                parentType: "Category",
                fieldName: "id",
                returnType: "ID!",
                startOffset: 85 * 1000000,
                duration: 1 * 1000000,
              },
              {
                path: ["listCategories", 1, "name"],
                parentType: "Category",
                fieldName: "name",
                returnType: "String",
                startOffset: 85 * 1000000,
                duration: 1 * 1000000,
              },
              {
                path: ["listActors", 0, "id"],
                parentType: "Actor",
                fieldName: "id",
                returnType: "ID!",
                startOffset: 98 * 1000000,
                duration: 1 * 1000000,
              },
              {
                path: ["listActors", 0, "name"],
                parentType: "Actor",
                fieldName: "name",
                returnType: "String",
                startOffset: 98 * 1000000,
                duration: 1 * 1000000,
              },
              {
                path: ["listActors", 1, "id"],
                parentType: "Actor",
                fieldName: "id",
                returnType: "ID!",
                startOffset: 98 * 1000000,
                duration: 1 * 1000000,
              },
              {
                path: ["listActors", 1, "name"],
                parentType: "Actor",
                fieldName: "name",
                returnType: "String",
                startOffset: 98 * 1000000,
                duration: 1 * 1000000,
              },
              {
                path: ["listActors", 2, "id"],
                parentType: "Actor",
                fieldName: "id",
                returnType: "ID!",
                startOffset: 98 * 1000000,
                duration: 2 * 1000000,
              },
              {
                path: ["listActors", 2, "name"],
                parentType: "Actor",
                fieldName: "name",
                returnType: "String",
                startOffset: 98 * 1000000,
                duration: 2 * 1000000,
              },
            ],
          },
        },
      },
    },
  }),
  createRequest({
    request: [
      {
        query: `
          query actorDetailsQuery($id: String) {
            actorDetails(id: $id) {
              ...actorDetailsData
              __typename
            }
          }
          fragment actorDetailsData on ActorDetail {
            id
            name
            __typename
          }
        `,
        variables: {
          id: "2",
        },
      },
    ],
    response: {
      data: {
        actorDetails: [],
      },
      extensions: {
        tracing: {
          version: 1,
          startTime: "2021-01-01T00:00:00.000Z",
          endTime: "2021-01-01T00:00:00.010Z",
          duration: 1173.12 * 1000000,
          execution: {
            resolvers: [
              {
                path: ["actorDetails"],
                parentType: "Query",
                fieldName: "actorDetails",
                returnType: "ActorDetail",
                startOffset: 1.187133 * 1000000,
                duration: 1171.787124 * 1000000,
              },
              {
                path: ["actorDetails", "test"],
                parentType: "ActorDetail",
                fieldName: "test",
                returnType: "string",
                startOffset: 1172.974257 * 1000000,
                duration: 0.02 * 1000000,
              },
            ],
          },
        },
      },
    },
  }),
  createRequest({
    request: [
      {
        query: `
          query actorDetailsQuery($id: String) {
            actorDetails(id: $id) {
              ...actorDetailsData
              __typename
            }
          }
          fragment actorDetailsData on ActorDetail {
            id
            name
            __typename
          }
        `,
        variables: {
          id: "3",
        },
      },
    ],
    response: {
      errors: [
        {
          message: "Details for actor with ID 3 could not be fetched",
        },
      ],
    },
  }),
]
