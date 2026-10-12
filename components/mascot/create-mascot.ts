import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** A genuinely volumetric, articulated interpretation of the Oday passport mascot. */
export function createMascot(brandTexture?: THREE.Texture) {
  const root = new THREE.Group();
  root.name = "oday-passport";
  const blue = new THREE.MeshPhysicalMaterial({ color: "#268fd7", roughness: 0.42, clearcoat: 0.3 });
  const darkBlue = new THREE.MeshStandardMaterial({ color: "#1375bd", roughness: 0.45 });
  const white = new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.55 });
  const gold = new THREE.MeshStandardMaterial({ color: "#f2bd50", metalness: 0.65, roughness: 0.3 });
  const ink = new THREE.MeshStandardMaterial({ color: "#102037", roughness: 0.38 });
  const iris = new THREE.MeshPhysicalMaterial({ color: "#1688cf", roughness: 0.23, clearcoat: 1 });
  const pupil = new THREE.MeshStandardMaterial({ color: "#03111d", roughness: 0.2 });
  const pink = new THREE.MeshStandardMaterial({ color: "#f05b55", roughness: 0.55 });
  const sphereGeometry = new THREE.SphereGeometry(1, 24, 16);

  function ellipsoid(parent: THREE.Object3D, material: THREE.Material, position: number[], scale: number[]) {
    const mesh = new THREE.Mesh(sphereGeometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    parent.add(mesh);
    return mesh;
  }

  function box(parent: THREE.Object3D, material: THREE.Material, size: number[], position: number[], radius = 0.04) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(size[0], size[1], size[2], 3, radius), material);
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
    return mesh;
  }

  function tube(parent: THREE.Object3D, material: THREE.Material, points: number[][], radius: number) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, radius, 8, false), material);
    parent.add(mesh);
    return mesh;
  }

  // Page block between two beveled leather covers; the spine makes the depth readable.
  box(root, white, [1.7, 2.24, 0.18], [0.025, 1.94, -0.07], 0.035);
  box(root, darkBlue, [1.82, 2.4, 0.12], [0, 1.94, -0.2], 0.055);
  box(root, blue, [1.82, 2.4, 0.16], [0, 1.94, 0.09], 0.065);
  box(root, darkBlue, [0.12, 2.32, 0.34], [-0.855, 1.94, -0.045], 0.05);
  for (const y of [0.87, 3.01]) {
    const sign = y > 2 ? -1 : 1;
    tube(root, gold, [[0.63, y + sign * 0.05, 0.2], [0.78, y + sign * 0.05, 0.2], [0.83, y + sign * 0.1, 0.2], [0.83, y + sign * 0.25, 0.2]], 0.035);
  }

  const eyes: THREE.Group[] = [];
  for (const x of [-0.34, 0.34]) {
    const eye = new THREE.Group();
    eye.position.set(x, 2.4, 0.18);
    root.add(eye);
    ellipsoid(eye, darkBlue, [0, 0, 0.005], [0.258, 0.35, 0.11]);
    ellipsoid(eye, white, [0, 0, 0.055], [0.23, 0.32, 0.105]);
    ellipsoid(eye, iris, [0.015, -0.015, 0.147], [0.132, 0.187, 0.047]);
    ellipsoid(eye, pupil, [0.023, -0.009, 0.186], [0.089, 0.139, 0.024]);
    ellipsoid(eye, white, [-0.016, 0.057, 0.209], [0.033, 0.043, 0.012]);
    ellipsoid(eye, white, [0.059, -0.067, 0.205], [0.013, 0.017, 0.008]);
    tube(root, ink, [[x - 0.19, 2.85, 0.22], [x - 0.08, 2.93, 0.25], [x + 0.07, 2.94, 0.25], [x + 0.17, 2.87, 0.22]], 0.055);
    eyes.push(eye);
  }

  // Opaque wayfarer lenses cover the eyes completely, including during a blink.
  for (const eye of eyes) eye.visible = false;
  const glasses = new THREE.Group();
  glasses.name = "sunglasses";
  root.add(glasses);
  const frameMaterial = new THREE.MeshPhysicalMaterial({ color: "#090e17", roughness: 0.25, clearcoat: 1 });
  const lensMaterial = new THREE.MeshPhysicalMaterial({ color: "#071d2c", metalness: 0.35, roughness: 0.13, clearcoat: 1 });
  const reflectionMaterial = new THREE.MeshBasicMaterial({ color: "#89bfd5", transparent: true, opacity: 0.32 });

  function lensShape(width: number, height: number) {
    const shape = new THREE.Shape();
    const x = width / 2;
    const y = height / 2;
    shape.moveTo(-x + 0.08, y);
    shape.lineTo(x - 0.08, y);
    shape.quadraticCurveTo(x, y, x, y - 0.08);
    shape.lineTo(x - 0.045, -y + 0.1);
    shape.quadraticCurveTo(x - 0.055, -y, x - 0.15, -y);
    shape.lineTo(-x + 0.15, -y);
    shape.quadraticCurveTo(-x + 0.055, -y, -x + 0.045, -y + 0.1);
    shape.lineTo(-x, y - 0.08);
    shape.quadraticCurveTo(-x, y, -x + 0.08, y);
    return shape;
  }

  for (const x of [-0.35, 0.35]) {
    const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(lensShape(0.65, 0.51), { depth: 0.055, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, steps: 1 }), frameMaterial);
    frame.position.set(x, 2.43, 0.25);
    glasses.add(frame);
    const lens = new THREE.Mesh(new THREE.ExtrudeGeometry(lensShape(0.545, 0.405), { depth: 0.015, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, steps: 1 }), lensMaterial);
    lens.position.set(x, 2.435, 0.31);
    glasses.add(lens);
    tube(glasses, reflectionMaterial, [[x - 0.17, 2.51, 0.338], [x - 0.07, 2.59, 0.338]], 0.016);
  }
  tube(glasses, frameMaterial, [[-0.055, 2.51, 0.29], [0, 2.55, 0.31], [0.055, 2.51, 0.29]], 0.036);
  for (const sign of [-1, 1]) {
    tube(glasses, frameMaterial, [[sign * 0.65, 2.58, 0.28], [sign * 0.9, 2.6, 0.16], [sign * 0.94, 2.56, -0.12]], 0.038);
    ellipsoid(glasses, gold, [sign * 0.63, 2.59, 0.321], [0.024, 0.016, 0.008]);
  }

  function mouthShape(material: THREE.Material, shape: THREE.Shape, z: number) {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.009, bevelSegments: 2, steps: 1 }), material);
    mesh.position.set(0, 1.91, z);
    root.add(mesh);
  }
  const smile = new THREE.Shape();
  smile.moveTo(-0.36, 0.04);
  smile.quadraticCurveTo(0, -0.07, 0.36, 0.04);
  smile.bezierCurveTo(0.28, -0.43, -0.28, -0.43, -0.36, 0.04);
  mouthShape(ink, smile, 0.2);
  const teeth = new THREE.Shape();
  teeth.moveTo(-0.3, 0.008);
  teeth.quadraticCurveTo(0, -0.08, 0.3, 0.008);
  teeth.quadraticCurveTo(0.23, -0.17, 0, -0.15);
  teeth.quadraticCurveTo(-0.23, -0.17, -0.3, 0.008);
  mouthShape(white, teeth, 0.25);
  ellipsoid(root, pink, [-0.07, 1.63, 0.25], [0.095, 0.048, 0.035]);
  ellipsoid(root, pink, [0.07, 1.63, 0.25], [0.095, 0.048, 0.035]);

  // Gold biometric chip, including the central ring and etched lines.
  box(root, gold, [0.29, 0.2, 0.015], [0, 0.97, 0.183], 0.02);
  const chipRing = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.006, 8, 24), darkBlue);
  chipRing.position.set(0, 0.97, 0.2);
  root.add(chipRing);
  for (const sign of [-1, 1]) {
    tube(root, darkBlue, [[sign * 0.05, 0.97, 0.2], [sign * 0.135, 0.97, 0.2]], 0.004);
    tube(root, darkBlue, [[0, 0.97 + sign * 0.05, 0.2], [0, 0.97 + sign * 0.092, 0.2]], 0.004);
  }
  if (brandTexture) {
    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.34), new THREE.MeshBasicMaterial({ map: brandTexture, transparent: true, depthWrite: false }));
    label.position.set(0, 1.27, 0.185);
    root.add(label);
  }

  // A rounded footprint keeps the sole flush with the upper rather than a projecting slab.
  const soleOutline = new THREE.Shape();
  soleOutline.moveTo(0, -0.32);
  soleOutline.bezierCurveTo(0.2, -0.32, 0.265, -0.25, 0.27, -0.1);
  soleOutline.lineTo(0.29, 0.22);
  soleOutline.bezierCurveTo(0.29, 0.38, 0.18, 0.46, 0, 0.46);
  soleOutline.bezierCurveTo(-0.18, 0.46, -0.29, 0.38, -0.29, 0.22);
  soleOutline.lineTo(-0.27, -0.1);
  soleOutline.bezierCurveTo(-0.265, -0.25, -0.2, -0.32, 0, -0.32);
  const soleGeometry = new THREE.ExtrudeGeometry(soleOutline, {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.018,
    bevelSegments: 3,
    curveSegments: 16,
    steps: 1,
  });
  soleGeometry.rotateX(Math.PI / 2);

  // Keep the upper and toe cap above the outsole's bottom, with an overlapping seam.
  for (const x of [-0.47, 0.47]) {
    ellipsoid(root, darkBlue, [x, 0.58, -0.015], [0.115, 0.32, 0.12]);
    const shoe = new THREE.Group();
    shoe.position.set(x, 0.1, 0.05);
    shoe.rotation.y = x < 0 ? 0.15 : -0.15;
    root.add(shoe);
    const sole = new THREE.Mesh(soleGeometry, white);
    sole.position.y = 0.095;
    sole.scale.x = 0.96;
    shoe.add(sole);
    ellipsoid(shoe, blue, [0, 0.195, 0.015], [0.28, 0.17, 0.335]);
    box(shoe, white, [0.53, 0.18, 0.3], [0, 0.14, 0.285], 0.065);
    for (let i = 0; i < 3; i++) {
      const y = 0.365 - i * 0.018;
      const z = 0.08 + i * 0.065;
      tube(shoe, white, [[-0.12, y - 0.015, z], [0, y + 0.01, z + 0.02], [0.12, y - 0.015, z]], 0.019);
    }
  }

  // Empty left glove rests naturally at the side; the right arm remains articulated.
  tube(root, darkBlue, [[-0.87, 1.94, 0], [-1.06, 1.72, 0.04], [-1.09, 1.43, 0.08]], 0.095);
  ellipsoid(root, white, [-1.09, 1.43, 0.08], [0.105, 0.07, 0.1]);
  ellipsoid(root, white, [-1.11, 1.25, 0.1], [0.14, 0.18, 0.095]);
  for (let i = 0; i < 4; i++) {
    const y = i === 0 || i === 3 ? 1.135 : 1.1;
    ellipsoid(root, white, [-1.21 + i * 0.065, y, 0.12], [0.045, 0.12, 0.055]);
  }
  ellipsoid(root, white, [-0.965, 1.28, 0.14], [0.06, 0.11, 0.065]).rotation.z = -0.35;
  const arm = new THREE.Group();
  arm.name = "waving-arm";
  arm.position.set(0.8, 1.9, 0);
  arm.scale.setScalar(0.9);
  root.add(arm);
  tube(arm, darkBlue, [[0, 0, 0], [0.2, -0.1, 0.025], [0.32, 0.1, 0.07], [0.34, 0.38, 0.07]], 0.09);
  // Rounded, connected glove with folded fingers and a clear thumbs-up silhouette.
  ellipsoid(arm, white, [0.34, 0.4, 0.07], [0.115, 0.07, 0.105]);
  ellipsoid(arm, white, [0.36, 0.58, 0.095], [0.16, 0.19, 0.11]);
  ellipsoid(arm, white, [0.245, 0.78, 0.1], [0.073, 0.205, 0.075]).rotation.z = -0.08;
  for (let i = 0; i < 3; i++) {
    ellipsoid(arm, white, [0.39, 0.67 - i * 0.095, 0.19], [0.135, 0.059, 0.069]).rotation.z = -0.08;
  }

  function animate(seconds: number, wave = 0, lookX = 0, lookY = 0) {
    root.position.y = Math.sin(seconds * 1.8) * 0.022;
    root.rotation.set(lookY * 0.06, -0.15 + Math.sin(seconds * 0.7) * 0.065 + lookX * 0.16, -0.025 + Math.sin(seconds * 1.5) * 0.015);
    arm.rotation.z = -0.14 + wave * Math.sin(seconds * 12) * 0.2;
    const blinkTime = seconds % 5.4;
    const blink = blinkTime > 4.85 && blinkTime < 5.08 ? Math.max(0.08, Math.abs(blinkTime - 4.965) / 0.115) : 1;
    for (const eye of eyes) eye.scale.y = blink;
  }

  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    root.traverse((part) => {
      if (!(part instanceof THREE.Mesh)) return;
      geometries.add(part.geometry);
      for (const material of [part.material].flat()) materials.add(material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
  }

  animate(0);
  return { root, animate, dispose };
}
