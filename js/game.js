import * as THREE from 'three'
import { OrbitControls } from '../lib/OrbitControls.module.js'
import { GLTFLoader } from '../lib/GLTFLoader.module.js'


const endScreen = document.getElementById('endScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
const textureLoader = new THREE.TextureLoader();
//camera.position.set(4.61, 2.74, 8)
camera.position.set(0, 3, 8)

const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader()
const backgroundSound = new THREE.Audio(listener);
audioLoader.load('./sounds/one_0.mp3', function(buffer) {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.2);
    backgroundSound.play();
});

const deathSound = new THREE.Audio(listener);
audioLoader.load('./sounds/oof.mp3', function(buffer) {
    deathSound.setBuffer(buffer);
    deathSound.setLoop(false);
    deathSound.setVolume(0.8);
})

const jumpSound = new THREE.Audio(listener);
audioLoader.load('./sounds/jump_07.wav', function(buffer) {
    jumpSound.setBuffer(buffer);
    jumpSound.setLoop(false);
    jumpSound.setVolume(0.5);
})

const glloader = new GLTFLoader();
glloader.load( './models/old_fence.glb', function ( gltf ) {
    
        gltf.scene.position.y = -2;
        gltf.scene.position.z = -2.2;
        gltf.scene.position.x = 5
        gltf.scene.rotation.y = -Math.PI/2;
        gltf.scene.children[0].scale.multiplyScalar(0.025);
        scene.add(gltf.scene)
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    glloader.load( './models/old_fence.glb', function ( gltf ) {
        
            gltf.scene.position.y = -2;
            gltf.scene.position.z = -12.2;
            gltf.scene.position.x = 5
            gltf.scene.rotation.y = -Math.PI/2;
            gltf.scene.children[0].scale.multiplyScalar(0.025);
            scene.add(gltf.scene)
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );

glloader.load( './models/old_fence.glb', function ( gltf ) {
       
            gltf.scene.position.y = -2;
            gltf.scene.position.z = -2.2;
            gltf.scene.position.x = -5
            gltf.scene.rotation.y = Math.PI/2;
            
            
            gltf.scene.children[0].scale.multiplyScalar(0.025);
            scene.add(gltf.scene)
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );

        glloader.load( './models/old_fence.glb', function ( gltf ) {
                gltf.scene.position.y = -2;
                gltf.scene.position.z = -12.2;
                gltf.scene.position.x = -5
                gltf.scene.rotation.y = Math.PI/2;
                
                gltf.scene.children[0].scale.multiplyScalar(0.025);
                scene.add(gltf.scene)
            
            }, undefined, function ( error ) {
            
                console.error( error );
            
            } );



const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false;
controls.enableRotate = false;
controls.enableZoom = false;

class Box extends THREE.Mesh {
    constructor({
    width,
    height,
    depth,
    color = '#00ff00',
    texture = "",
    velocity = {
        x: 0,
        y: 0,
        z: 0
    },
    position = {
        x: 0,
        y: 0,
        z: 0
    },
    zAcceleration = false,
    filter = false
    }) {
    let mesh = null;
    if(texture != "") {
        const textureCube = textureLoader.load("./images/" + texture);
        if(filter) {
            textureCube.wrapS = THREE.RepeatWrapping;
            textureCube.wrapT = THREE.RepeatWrapping;
            textureCube.repeat.set( 4, 4 );

        }
        mesh = new THREE.MeshStandardMaterial({ color, map: textureCube })
    } else {
        mesh = new THREE.MeshStandardMaterial({ color })
    }
    super(
        new THREE.BoxGeometry(width, height, depth),
        mesh
    )

    this.width = width
    this.height = height
    this.depth = depth

    this.position.set(position.x, position.y, position.z)

    this.right = this.position.x + this.width / 2
    this.left = this.position.x - this.width / 2

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    this.front = this.position.z + this.depth / 2
    this.back = this.position.z - this.depth / 2

    this.velocity = velocity
    this.gravity = -0.002

    this.zAcceleration = zAcceleration
    }

    updateSides() {
    this.right = this.position.x + this.width / 2
    this.left = this.position.x - this.width / 2

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    this.front = this.position.z + this.depth / 2
    this.back = this.position.z - this.depth / 2
    }

    update(ground) {
    this.updateSides()

    if (this.zAcceleration) this.velocity.z += 0.0003

    this.position.x += this.velocity.x
    this.position.z += this.velocity.z

    this.applyGravity(ground)
    }

    applyGravity(ground) {
    this.velocity.y += this.gravity

    if (
        boxCollision({
        box1: this,
        box2: ground
        })
    ) {
        const friction = 0
        this.velocity.y *= friction
        this.velocity.y = -this.velocity.y
    } else this.position.y += this.velocity.y
    }
}

function boxCollision({ box1, box2 }) {
    const xCollision = box1.right >= box2.left && box1.left <= box2.right
    const yCollision =
    box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom
    const zCollision = box1.front >= box2.back && box1.back <= box2.front

    return xCollision && yCollision && zCollision
}

const cube = new Box({
    width: 1,
    height: 1,
    depth: 1,
    velocity: {
    x: 0,
    y: -0.01,
    z: 0
    },
    color: "white",
    texture: "roblox.jpg"
})
cube.castShadow = true
scene.add(cube)

const ground = new Box({
    width: 13,
    height: 0.5,
    depth: 44,
    color: 'white',
    position: {
    x: 0,
    y: -2,
    z: 0
    },
    texture: "Grass_02.png",
    filter: true
})

ground.receiveShadow = true
scene.add(ground)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.y = 3
light.position.z = 1
light.castShadow = true
scene.add(light)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))
camera.position.z = 5

const keys = {
    a: {
    pressed: false
    },
    d: {
    pressed: false
    },
    s: {
    pressed: false
    },
    w: {
    pressed: false
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.code) {
    case 'KeyA':
        keys.a.pressed = true
        break
    case 'KeyD':
        keys.d.pressed = true
        break
    case 'KeyS':
        keys.s.pressed = true
        break
    case 'KeyW':
        keys.w.pressed = true
        break
    case 'Space':
        if(cube.position.y < -1) {
            cube.velocity.y = 0.08
            jumpSound.play()
        }
        break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
    case 'KeyA':
        keys.a.pressed = false
        break
    case 'KeyD':
        keys.d.pressed = false
        break
    case 'KeyS':
        keys.s.pressed = false
        break
    case 'KeyW':
        keys.w.pressed = false
        break
    }
})

function finishGame() {
    backgroundSound.stop()
    clearInterval(scoreRefresh)
    deathSound.play()
    finalScoreDisplay.textContent = score; 
    endScreen.style.display = 'flex';
}

const scoreDisplay = document.getElementById('score');
let scoreRefresh = setInterval(function() {
        score += 1; // Incrementa la puntuación
        scoreDisplay.textContent = 'Score: ' + score; // Actualiza el marcador de puntuación
    }, 100);

const enemies = []

let frames = 0
let spawnRate = 125
function animate() {
    const animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)

    // movement code
    cube.velocity.x = 0
    cube.velocity.z = 0
    if (keys.a.pressed && cube.position.x > -4.2) cube.velocity.x = -0.05
    else if (keys.d.pressed && cube.position.x < 4.2) cube.velocity.x = 0.05

    if (keys.s.pressed && cube.position.z < 1.2) cube.velocity.z = 0.05
    else if (keys.w.pressed && cube.position.z > -4) cube.velocity.z = -0.05

    cube.update(ground)
    enemies.forEach((enemy) => {
    enemy.update(ground)
    if (
        boxCollision({
        box1: cube,
        box2: enemy
        })
    ) {
        cancelAnimationFrame(animationId)
        finishGame()
    }
    if(enemy.position.z > 6) {
        scene.remove(enemy)
    }
    })

    if (frames % spawnRate === 0) {
    if (spawnRate > 12.5) spawnRate -= 2.5
    const size = Math.random() * (1 - 0.8) + 0.8;
    const enemy = new Box({
        width: size,
        height: size,
        depth: size,
        position: {
        x: (Math.random() - 0.5) * 8,
        y: 0,
        z: -20
        },
        velocity: {
        x: 0,
        y: 0,
        z: 0.005
        },
        color: 'white',
        texture: "donottouch.png",
        zAcceleration: true
    })
    enemy.castShadow = true
    scene.add(enemy)
    enemies.push(enemy)
    }

    frames++
}
animate()

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
