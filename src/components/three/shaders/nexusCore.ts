import * as THREE from 'three';

export const nexusVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uDistort;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;
    float wave = sin(pos.y * 4.0 + uTime * 1.8) * 0.04;
    wave += sin(pos.x * 3.0 - uTime * 1.2) * 0.03;
    pos += normal * wave * uDistort;
    pos.x += uPointer.x * 0.12 * uDistort;
    pos.y += uPointer.y * 0.1 * uDistort;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;

    vec4 mvPosition = viewMatrix * worldPos;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const nexusFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float hexGrid(vec2 p, float scale) {
    p *= scale;
    vec2 h = vec2(1.0, 1.732);
    vec2 a = mod(p, h) - h * 0.5;
    vec2 b = mod(p - h * 0.5, h) - h * 0.5;
    return min(dot(a, a), dot(b, b));
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);

    float hex = hexGrid(vUv * 6.0 + uTime * 0.08, 8.0);
    float hexLine = smoothstep(0.02, 0.0, hex);

    float scan = sin(vWorldPosition.y * 18.0 - uTime * 3.5) * 0.5 + 0.5;
    scan = pow(scan, 6.0) * 0.35;

    float pulse = 0.85 + sin(uTime * 2.2) * 0.15;
    float energy = fresnel * pulse + hexLine * 0.45 + scan;

    vec3 base = mix(uColorA, uColorB, fresnel);
    base = mix(base, uColorC, hexLine * 0.6);
    base += energy * uColorB * 1.2;
    base *= 1.15;

    float alpha = 0.65 + fresnel * 0.35 + hexLine * 0.25;
    alpha *= mix(1.0, 0.7, uProgress * 0.5);

    gl_FragColor = vec4(base, alpha);
  }
`;

export function createNexusMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: nexusVertexShader,
    fragmentShader: nexusFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uDistort: { value: 1 },
      uColorA: { value: new THREE.Color('#010208') },
      uColorB: { value: new THREE.Color('#34d399') },
      uColorC: { value: new THREE.Color('#22d3ee') },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
