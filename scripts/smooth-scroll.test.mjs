import assert from "node:assert/strict";
import test from "node:test";
import { createSmoothScroll } from "../lib/smooth-scroll.ts";

test("creates Lenis with a managed animation frame and cleans it up", () => {
  const frames = [];
  const cancelled = [];
  let destroyed = false;

  class FakeLenis {
    constructor(options) {
      this.options = options;
    }

    raf(time) {
      this.lastFrame = time;
    }

    destroy() {
      destroyed = true;
    }
  }

  const smoothScroll = createSmoothScroll({
    Lenis: FakeLenis,
    requestFrame: (callback) => {
      frames.push(callback);
      return frames.length;
    },
    cancelFrame: (frameId) => cancelled.push(frameId),
  });

  assert.equal(smoothScroll.lenis.options.smoothWheel, true);
  assert.equal(frames.length, 1);

  frames[0](16);
  assert.equal(smoothScroll.lenis.lastFrame, 16);
  assert.equal(frames.length, 2);

  smoothScroll.destroy();
  assert.equal(destroyed, true);
  assert.deepEqual(cancelled, [2]);
});
