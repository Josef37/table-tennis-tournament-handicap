import tap from "tap";
import { bisection, choose, newtonsMethod, range } from "./utils";
import { isClose } from "./testUtils";

tap.test("choose", async (t) => {
  t.equal(choose(0, 0), 1);
  t.equal(choose(3, 1), 3);
  t.equal(choose(5, 2), 10);
});

tap.test("range", async (t) => {
  t.same(range(0, 3), [0, 1, 2, 3]);
  t.same(range(0, 4, 2), [0, 2, 4]);
  t.same(range(0, 4, -1), []);
  t.same(range(0, -8, -3), [0, -3, -6]);
});

tap.test("newtonsMethod", async (t) => {
  const precision = 0.001;
  isClose(t, precision)(
    newtonsMethod((x) => x ** 2, 1, { precision }),
    0
  );
  isClose(t, precision)(
    newtonsMethod((x) => (x - 1) ** 2, 0, { precision }),
    1
  );
});

tap.test("bisection", async (t) => {
  const precision = 0.001;
  isClose(t, precision)(
    bisection((x) => x ** 2 - 1, [0, 3], { precision }),
    1
  );
  isClose(t, precision)(
    bisection((x) => x ** 3, [-1, 2], { precision }),
    0
  );
});
