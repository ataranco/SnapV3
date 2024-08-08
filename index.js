import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SNAP from './src/index.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

async function init(){    
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );
    
    camera.position.z = 5;
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
    directionalLight.position.set( - 5, 25, - 1 );
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = - 30;
    directionalLight.shadow.camera.top	= 30;
    directionalLight.shadow.camera.bottom = - 30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = - 0.00006;
    scene.add( directionalLight );   
    
    const loader = new GLTFLoader().setPath( './models/' );
    var gltf = await loader.loadAsync( 'collision-world.glb'); 
    var sceneCollider = gltf.scene;
    scene.add(sceneCollider);

    document.addEventListener("click", ()=> {
        console.log("click");
        let objectSize = new THREE.Vector3(0.5,0.5,0.5);
        SNAP.generateSnapPoint(objectSize);
    })

    console.log(SNAP);
    SNAP.init(scene, sceneCollider.children, camera);
}

init();

function animate() {

	renderer.render( scene, camera );
}

