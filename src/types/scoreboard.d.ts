interface ScoreboardHeader {
  title: string;
  selector: (row: ScoreboardRow) => string | number;
}

interface ScoreCell {
  avg: number;
  count: number;
  max: number;
  min: number;
  pid: number;
}

interface ScoreboardRow {
  user: UserInfo;
  avg: number;
  sum: number;
  [key: `${number}`]: ScoreCell;
}

type Scoreboard = ScoreboardRow[];
