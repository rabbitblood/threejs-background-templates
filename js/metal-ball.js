import * as THREE from './three.module.js';



const colorTemplate = ["#ff6e27", "#fbf665", "#73fffe", "#6287f8", "#383e65"]


const bg = document.querySelector('#bg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, bg.clientWidth / bg.clientHeight, 0.1, 1000);


//texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./../image/tech-nmap.jpg');

//material
const materialBasic = new THREE.MeshBasicMaterial({ color: "#fbf665", wireframe: true });
const materialStandard = new THREE.MeshStandardMaterial({ color: "#000000" });
materialStandard.metalness = 0.1;
materialStandard.roughness = 0.35;
materialStandard.normalMap = texture;



const renderer = new THREE.WebGLRenderer({ canvas: bg });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(bg.clientWidth, bg.clientHeight);
renderer.setClearColor("#000000", 0);
document.body.appendChild(renderer.domElement);

//cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, materialBasic);


//capsule geometry
const capsuleGeo = new THREE.CapsuleGeometry(0.5, 0.5, 15, 15);
const capsule = new THREE.Mesh(capsuleGeo, materialBasic);


//torus
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 100);
const torus = new THREE.Mesh(torusGeometry, materialStandard);

//sphere
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sphere = new THREE.Mesh(sphereGeometry, materialStandard);
scene.add(sphere);


//light
const light1 = new THREE.PointLight("red", 1, 50);
light1.intensity = 50;
light1.position.set(20, 0, 5);
scene.add(light1);

const light2 = new THREE.PointLight("blue", 1, 50);
light2.intensity = 50;
light2.position.set(-20, 0, 5);
scene.add(light2);

//control
if (window.innerWidth > window.innerHeight) {
    camera.position.z = 5;
}
else {
    camera.position.z = 10;
}

cube.position.x = -3;
capsule.position.x = 3;



//canvas responsive when window resize
window.addEventListener('resize', function () {
    bg.style.width = window.innerWidth + 'px';
    bg.style.height = window.innerHeight + 'px';
    camera.aspect = bg.clientWidth / bg.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(bg.clientWidth, bg.clientHeight);
});

//functions \

class star {
    constructor() {
        this.geometry = new THREE.SphereGeometry(Math.random() * 1 + 0.5, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: "black" });
        this.star = new THREE.Mesh(this.geometry, this.material);

        this.originalx = Math.random() * 40 - 20;
        this.originaly = Math.random() * 40 - 20;
        this.originalz = Math.random() * -60 - 10;

        this.destinationx;
        this.destinationy;
        this.destinationz;

        this.moveSpeed = 0.002;

        this.newDestination();

        this.star.position.set(
            this.originalx,
            this.originaly,
            this.originalz
        );

        scene.add(this.star);
    }

    move() {
        this.star.position.x += (this.destinationx - this.star.position.x) * this.moveSpeed;
        this.star.position.y += (this.destinationy - this.star.position.y) * this.moveSpeed;
        this.star.position.z += (this.destinationz - this.star.position.z) * this.moveSpeed;

        if (Math.abs(this.star.position.x - this.destinationx) < 0.5 ||
            Math.abs(this.star.position.y - this.destinationy) < 0.5 ||
            Math.abs(this.star.position.z - this.destinationz) < 0.5) {
            this.newDestination();
        }
    }

    newDestination() {
        this.destinationx = this.originalx + Math.random() * 10 - 5;
        this.destinationy = this.originaly + Math.random() * 10 - 5;
        this.destinationz = this.originalz + Math.random() * 10 - 5;
    }
}

let stars = [];

function addStars() {
    for (let i = 0; i < 500; i++) {
        stars.push(new star());
    }
}


let x = 0;
let y = 0;

//movement control
document.addEventListener('mousemove', function (e) {
    x = e.clientX / window.innerWidth - 0.5;
    y = e.clientY / window.innerHeight - 0.5;
});


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    sphere.rotation.y -= 0.01;

    for (const star of stars) {
        star.move();
    }

    sphere.position.z = -y * 2;
    sphere.rotation.x += y * 0.1;
    sphere.rotation.y += x * 0.1;
}
animate();
addStars();