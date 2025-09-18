import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { puzzleData, storedPuzzle } from '@/lib/graphql/server/resolvers';
import { typeDefs } from '@/lib/graphql/server/typeDefs';
import { schema } from '@/lib/graphql/server/schema';


const resolvers = {
    Query: {
        puzzleData,
        storedPuzzle
    },
};

const server = new ApolloServer({
    resolvers,
    typeDefs
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };