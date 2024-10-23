uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uScale;

varying vec3 vPosition;

void main() {
    vec3 color = vec3(1.0,0,0);
    vec3 color1 = vec3(1.0, 0.0, 0.0);
    vec3 color2 = vec3(1.0, 1.0, 0.0);

    float depth = vPosition.z * 0.5 + 0.5;
    color = mix(uColor1, uColor2, depth);

    float baseOpacity = depth * 0.3 + 0.5;

    float finalOpacity = baseOpacity * (uScale * uScale);

    gl_FragColor = vec4(color, finalOpacity);
}