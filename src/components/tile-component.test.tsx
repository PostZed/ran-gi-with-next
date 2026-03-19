
import { fireEvent, render, screen } from "@testing-library/react";
import { TileComponent } from './game'
import { Board, Tile } from "@/game/board";
import { BLUE, GREEN, NUM_ONLY, RED, WHITE, YELLOW } from "@/lib/constants";
import { describe, expect, test } from '@jest/globals'


it("Tile changes colour according to current palette in use.", () => {
  Board.palette = [YELLOW, GREEN, RED, BLUE, WHITE]
  //(col, row, color, hint, count)
  let col, row
  col = row = 0
  const testId = `${col} ${row}`
  const numOnlyTestTile = new Tile(col, row, 0xff00ff, NUM_ONLY, 2);
  render(<TileComponent tile={numOnlyTestTile} dimensions={10} />);

  expect(screen.getByTestId(testId)).toHaveTextContent('2');
  fireEvent.click(screen.getByTestId(testId));
  expect(numOnlyTestTile.fillColor).toEqual(YELLOW)
  fireEvent.click(screen.getByTestId(testId));
  expect(numOnlyTestTile.fillColor).toEqual(GREEN)
});
