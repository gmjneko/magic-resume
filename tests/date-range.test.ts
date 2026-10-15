import test from "node:test";
import assert from "node:assert/strict";
import {
  isPresentToken,
  splitDateRange,
} from "../src/lib/date-range";
import { formatDateRange, formatDateString } from "../src/lib/utils";

test("recognizes present tokens", () => {
  assert.equal(isPresentToken("至今"), true);
  assert.equal(isPresentToken(" Present "), true);
  assert.equal(isPresentToken("To Present"), true);
  assert.equal(isPresentToken("Now"), true);
  assert.equal(isPresentToken("2020-至今"), false);
});

test("splits open-ended date ranges", () => {
  assert.deepEqual(splitDateRange("2020-至今"), { start: "2020", end: "至今" });
  assert.deepEqual(splitDateRange("2024/09-至今"), { start: "2024/09", end: "至今" });
  assert.deepEqual(splitDateRange("2024.09-至今"), { start: "2024.09", end: "至今" });
  assert.deepEqual(splitDateRange("2024-09-至今"), { start: "2024-09", end: "至今" });
  assert.deepEqual(splitDateRange("2020 - 至今"), { start: "2020", end: "至今" });
  assert.deepEqual(splitDateRange("2020-Present"), { start: "2020", end: "Present" });
  assert.deepEqual(splitDateRange("2020 - To Present"), { start: "2020", end: "To Present" });
  assert.deepEqual(splitDateRange("2024-09-01 - 至今"), { start: "2024-09-01", end: "至今" });
});

test("keeps closed ranges and single dates", () => {
  assert.deepEqual(splitDateRange("2020-2024"), { start: "2020", end: "2024" });
  assert.deepEqual(splitDateRange("2024/09-2025/06"), { start: "2024/09", end: "2025/06" });
  assert.deepEqual(splitDateRange("2024-09 - 2025-06"), { start: "2024-09", end: "2025-06" });
  assert.deepEqual(splitDateRange("2023.01 - 2024.01"), { start: "2023.01", end: "2024.01" });
  assert.equal(splitDateRange("2024-09"), null);
  assert.equal(splitDateRange("2024-09-01"), null);
  assert.equal(splitDateRange("至今"), null);
  assert.equal(splitDateRange(""), null);
});

test("formats present ranges for display", () => {
  assert.equal(formatDateString("2020-至今", "zh"), "2020 - 至今");
  assert.equal(formatDateString("2024/09-至今", "zh"), "2024/09 - 至今");
  assert.equal(formatDateString("2024-09-至今", "zh"), "2024/09 - 至今");
  assert.equal(formatDateString("2020 - Present", "zh"), "2020 - 至今");
  assert.equal(formatDateString("2024/09-2025/06", "zh"), "2024/09 - 2025/06");
  assert.equal(formatDateString("2024-09", "zh"), "2024/09");
  assert.equal(formatDateString("至今", "zh"), "至今");
  assert.equal(formatDateString("2020-至今", "en"), "2020 - Present");
  assert.equal(formatDateRange("2025/09", "至今", "zh"), "2025/09 - 至今");
});
