import gql from 'graphql-tag';

export const typeDefs = gql`
  type TileInfo{
    col:Int! 
    row:Int!
    color:Int
    hint:Int!
    isClueSquare:Boolean!
    count:Int!
}

  type PuzzleInfo{
    puzzle:[TileInfo!]!
    id:String
}

  type Query{
    puzzleData(size:Int!):PuzzleInfo
    storedPuzzle(id:String!):[TileInfo!]!
}
`