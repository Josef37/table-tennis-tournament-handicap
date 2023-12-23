import tap from "tap";
import { bisection, choose, newtonsMethod } from "./utils";
import { isClose } from "./testUtils";

tap.test("choose", async (t) => {
  t.equal(choose(0, 0), 1);
  t.equal(choose(3, 1), 3);
  t.equal(choose(5, 2), 10);
});

tap.test("newtonsMethod", async (t) => {
  const precision = 0.001;
  isClose(t)(
    newtonsMethod((x) => x ** 2, 1, { precision }),
    0,
    precision
  );
  isClose(t)(
    newtonsMethod((x) => (x - 1) ** 2, 0, { precision }),
    1,
    precision
  );
});
