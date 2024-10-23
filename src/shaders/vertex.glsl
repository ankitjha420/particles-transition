uniform float uTime;
uniform float uScale;

attribute vec3 aRandom;

varying vec3 vPosition;

void main() {
    vPosition = position;

    vec3 pos = position;
    float time = 4.0 * uTime;

    pos.x += sin(time * aRandom.x) * 0.01 * uScale;
    pos.y += cos(time * aRandom.y) * 0.01 * uScale;
    pos.x += cos(time * aRandom.z) * 0.01 * uScale;

    pos.x *= uScale + (sin(pos.y * 4.0 + time) * (1.0 - uScale) * uScale);
    pos.y *= uScale + (cos(pos.z * 4.0 + time) * (1.0 - uScale) * uScale);
    pos.z *= uScale + (sin(pos.x * 4.0 + time) * (1.0 - uScale) * uScale);

    float transitionFactor = (1.0 - uScale) * uScale * 4.0;
    pos += aRandom * transitionFactor * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float baseSize = 8.0;
    float sizeMultiplier = uScale * (1.0 + transitionFactor * 0.5);
    gl_PointSize = (baseSize * sizeMultiplier) / -mvPosition.z;
}