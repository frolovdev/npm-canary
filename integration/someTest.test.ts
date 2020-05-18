import { func as func1 } from "@someinterestingtestnamesorrynpmforthisasdsadasdasdasd/packageone";
import { func as func2 } from "@someinterestingtestnamesorrynpmforthisasdsadasdasdasd/packgetwo";

describe("integration test", () => {
  it("should some validate integration tests", () => {
    expect(func1(1, 1)).toEqual(2);
    expect(func2(1, 1)).toEqual(2);
  });
});
