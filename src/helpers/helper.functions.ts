import * as THREE from "three"
import gsap from "gsap"

export const skullToHorse = (child1: THREE.Object3D, child2: THREE.Object3D) => {
	gsap.to(child2.material.uniforms.uScale, {value: 1, duration: 1, ease: 'power3.inOut', delay: 0.2})
	gsap.to(child1.material.uniforms.uScale, {value: 0, duration: 1, ease: 'power3.inOut', delay: 0.2})
}
export const horseToSkull = (child1: THREE.Object3D, child2: THREE.Object3D) => {
	gsap.to(child2.material.uniforms.uScale, {value: 0, duration: 1, ease: 'power3.inOut', delay: 0.2})
	gsap.to(child1.material.uniforms.uScale, {value: 1, duration: 1, ease: 'power3.inOut', delay: 0.2})
}