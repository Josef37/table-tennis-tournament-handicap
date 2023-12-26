import tap from "tap";
import { range } from "./utils";

tap.test("range", async (t) => {
  t.same(range(0, 3), [0, 1, 2, 3]);
  t.same(range(0, 4, 2), [0, 2, 4]);
  t.same(range(0, 4, -1), []);
  t.same(range(0, -8, -3), [0, -3, -6]);
});
