import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import {MeshSurfaceSampler} from 'three/addons/math/MeshSurfaceSampler'
import vertexShader from '../shaders/vertex.glsl?raw'
import fragmentShader from '../shaders/fragment.glsl?raw'

type ModelFileProps = {
	name: string
	filepath: string
}
type ModelMaterialProps = {
	color: string
	wireframe: boolean
	size: number
	color1: string
	color2: string
}
type ModelProps = {
	material: ModelMaterialProps
	file: ModelFileProps
}

const getModelGeometry = (props: ModelFileProps): Promise<THREE.BufferGeometry> => {
	const loader = new GLTFLoader()
	const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
	loader.setDRACOLoader(dracoLoader)

	return new Promise((resolve, reject) => {
		loader.load(
			'/models/' + props.filepath,
			(gltf) => {
				const mesh = gltf.scene.children[0] as THREE.Mesh
				resolve(mesh.geometry)
			},
			undefined,
			(error) => {
				reject(error)
			}
		)
	})
}

const getPointsMaterial = (props: ModelMaterialProps): THREE.PointsMaterial => {
	return new THREE.PointsMaterial({
		color: props.color,
		size: props.size
	})
}

export const getModelMesh = async (props: ModelProps) => {
	const geometry: THREE.BufferGeometry = await getModelGeometry(props.file)
	const pointsMaterial = getPointsMaterial(props.material)
	const mesh = new THREE.Points(geometry, pointsMaterial)
	const points = getMeshSample(mesh, 20000,
		getShaderMaterial(props.material.color1, props.material.color2)
	)
	points.name = props.file.name
	return points
}

const getMeshSample = (mesh: THREE.Points, particleCount: number, material: THREE.ShaderMaterial) => {
	const geometry = mesh.geometry
	const tempMesh = new THREE.Mesh(geometry)

	const sampler = new MeshSurfaceSampler(tempMesh).build()
	const particlesGeometry = new THREE.BufferGeometry()
	const particlesPosition = new Float32Array(particleCount * 3)
	const particlesRandomness = new Float32Array(particleCount * 3)

	for (let i = 0; i < particleCount; i++) {
		const newPosition = new THREE.Vector3()
		sampler.sample(newPosition)
		particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3)

		particlesRandomness.set([
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1
		], i * 3)
	}

	particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
	particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3))

	return new THREE.Points(particlesGeometry, material)
}

const getShaderMaterial = (color1: string, color2: string): THREE.ShaderMaterial => {
	return new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		transparent: true,
		depthWrite: false,
		depthTest: false,
		blending: THREE.AdditiveBlending,
		uniforms: {
			uColor1: {value: new THREE.Color(color1)},
			uColor2: {value: new THREE.Color(color2)},
			uTime: {value: 0},
			uScale: {value: 0}
		}
	})
}