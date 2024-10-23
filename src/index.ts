import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls'
import {getModelMesh} from './components/Model.ts'
import gsap from 'gsap'
import {horseToSkull, skullToHorse} from "./helpers/helper.functions.ts";

// Renderer ->
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Scene & Camera ->
const camera = new THREE.PerspectiveCamera(50,
	window.innerWidth / window.innerHeight, 0.1, 100
)
camera.position.set(0, 1, 5)
const scene = new THREE.Scene()

// Controls ->
const orbitControls = new OrbitControls(camera, renderer.domElement)

// Models ->
const skull = await getModelMesh({
	material: {color: 'red', wireframe: true, size: 0.02, color1: 'red', color2: 'yellow'},
	file: {
		name: 'skull',
		filepath: 'skull.glb'
	}
})
skull.material.uniforms.uScale.value = 1
scene.add(skull)

const horse = await getModelMesh({
	material: {color: 'blue', wireframe: true, size: 0.02, color1: 'blue', color2: 'pink'},
	file: {
		name: 'horse',
		filepath: 'horse.glb'
	}
})
horse.material.uniforms.uScale.value = 0
scene.add(horse)

// Clock ->
const clock = new THREE.Clock()

// Loop ->
const animate = () => {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
	orbitControls.update()
	if (scene.children[0].name) {
		skull.material.uniforms.uTime.value = clock.getElapsedTime()
		horse.material.uniforms.uTime.value = clock.getElapsedTime()
	}
}
animate()

/* EVENT LISTENERS */

// Resize ->
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

// @ts-ignore switch button ->
document.getElementById('switch').addEventListener('click', () => {
	const child1 = scene.children[0]
	const child2 = scene.children[1]

	if (child2.material.uniforms.uScale.value === 1) {
		horseToSkull(child1, child2)
	} else {
		skullToHorse(child1, child2)
	}
})

document.addEventListener('mousemove', (e) => {
	const x = e.clientX
	const y = e.clientY
	gsap.to(scene.rotation, {
		y: gsap.utils.mapRange(0, window.innerWidth, -0.5, 0.5, x),
		x: gsap.utils.mapRange(0, window.innerHeight, -0.5, 0.5, y)
	})
})