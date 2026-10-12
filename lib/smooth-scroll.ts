type LenisInstance = {
  raf: (time: number) => void;
  destroy: () => void;
};

type LenisConstructor = new (options: {
  autoRaf: false;
  lerp: number;
  smoothWheel: true;
}) => LenisInstance;

type SmoothScrollDependencies = {
  Lenis: LenisConstructor;
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (frameId: number) => void;
};

export function createSmoothScroll({
  Lenis,
  requestFrame,
  cancelFrame,
}: SmoothScrollDependencies) {
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
  });

  let frameId = 0;

  const onFrame: FrameRequestCallback = (time) => {
    lenis.raf(time);
    frameId = requestFrame(onFrame);
  };

  frameId = requestFrame(onFrame);

  return {
    lenis,
    destroy() {
      cancelFrame(frameId);
      lenis.destroy();
    },
  };
}
