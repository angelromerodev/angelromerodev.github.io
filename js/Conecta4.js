//import * as THREE from 'three';

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);

// Configuración de la cámara
camera.position.z = 5;

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Creación del tablero
const tablero = new THREE.Object3D();
scene.add(tablero);

// Dimensiones del tablero
const anchoTablero = 7;
const altoTablero = 6;

// Posición inicial de las fichas
const fichas = [];
for (let i = 0; i < anchoTablero; i++) {
    for (let j = 0; j < altoTablero; j++) {
        const ficha = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        ficha.position.x = i - anchoTablero / 2 + 0.5;
        ficha.position.y = j - altoTablero / 2 + 0.5;
        ficha.position.z = 0;
        fichas.push(ficha);
        tablero.add(ficha);
    }
}

// Función para animar la caída de las fichas
function animarCaida(ficha, yObjetivo) {
    const tween = new TWEEN.Tween(ficha.position)
        .to({ y: yObjetivo }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

// Función para detectar si hay 4 en raya
function detectarVictoria(fichas) {
    // ... (implementación de la lógica para detectar 4 en raya) ...
}

// Bucle de animación
function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    renderer.render(scene, camera);
}

animate();