import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Box3, Mesh, Vector3 } from 'three';
import { createMascot } from '../components/mascot/create-mascot.ts';

test('the passport buddy has real depth and stays inside its camera frame while waving', () => {
  const mascot = createMascot();
  let meshes = 0;
  mascot.root.traverse((part) => { if (part instanceof Mesh) meshes++; });
  assert.ok(meshes > 20, 'The character needs modeled body, face, and limbs');
  for (const seconds of [0, 0.3, 1, 2, 5, 8]) {
    mascot.animate(seconds, 1);
    mascot.root.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(mascot.root);
    const size = bounds.getSize(new Vector3());
    assert.ok(size.z > 0.5, 'The character must be a volume, not a flat picture');
    assert.ok(bounds.min.x > -1.65 && bounds.max.x < 1.65, 'Hands stay inside the frame');
    assert.ok(bounds.min.y > -0.1 && bounds.max.y < 3.7, 'Feet and fingers stay inside the frame');
  }
  const arm = mascot.root.getObjectByName('waving-arm');
  assert.ok(arm);
  mascot.animate(0.1, 1);
  const start = arm.rotation.z;
  mascot.animate(0.3, 1);
  assert.notEqual(arm.rotation.z, start, 'The wave must move the actual arm');
  mascot.dispose();
});

test('cleanup releases every model geometry and material', () => {
  const mascot = createMascot();
  const resources = new Set();
  mascot.root.traverse((part) => {
    if (!(part instanceof Mesh)) return;
    resources.add(part.geometry);
    for (const material of [part.material].flat()) resources.add(material);
  });
  let disposed = 0;
  for (const resource of resources) resource.addEventListener('dispose', () => disposed++);
  mascot.dispose();
  assert.equal(disposed, resources.size);
});
