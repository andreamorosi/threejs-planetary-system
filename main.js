import './style.css'

import * as THREE from 'three';

import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';

let container, stats;
let camera, scene, raycaster, renderer, dragControls, ghostObj
let sceneContainer = document.querySelector('#scene')
let clock = new THREE.Clock()

let INTERSECTED;
let theta = 0

var planets = []
var mainPlanet

const pointer = new THREE.Vector2();
const radius = 100;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 70, sceneContainer.clientWidth / sceneContainer.clientHeight, 1, 10000 );
  camera.position.set(1,1,100)

  scene = new THREE.Scene();
  //scene.background = new THREE.Color( 0x040F1A );

  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 20, -20, 100 ).normalize();
  scene.add( light );

  /*const hemisLight = new THREE.HemisphereLight( 0xDEFFFF, 0x0f0f20, 1 )
  hemisLight.position.set( 10, -10, 10 ).normalize();
  scene.add(hemisLight)*/
  const ambientLight = new THREE.AmbientLight( 0x404040 )
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight( 0x404040, 2, 500, 2)
  pointLight.position.set(-75,25,-5)
  scene.add(pointLight)

  /*
  * GEOMETRIES - SHAPES GENERATION
  */
  // Spheres generation
  // mainPlanet
  const geometrySphere = new THREE.SphereGeometry( 28, 64, 32 );
  const materialSphere = new THREE.MeshLambertMaterial( { color: 0x935CF2 } );
  mainPlanet = new THREE.Mesh( geometrySphere, materialSphere );
  scene.add( mainPlanet );
  mainPlanet.position.x = -58
  mainPlanet.position.y = -5
  mainPlanet.position.z = -15

  // planetOne
  const geometryPlanetOne = new THREE.SphereGeometry( 8, 64, 32 );
  const materialPlanetOne = new THREE.MeshLambertMaterial( { color: 0xD43919 } );
  var planetOne = new THREE.Mesh( geometryPlanetOne, materialPlanetOne );
  scene.add( planetOne );
  planetOne.position.x = -6
  planetOne.position.y = 27
  planetOne.position.z = 5
  planets.push(planetOne)

  // planetTwo
  const geometryPlanetTwo = new THREE.SphereGeometry( 8, 64, 32 );
  const materialPlanet = new THREE.MeshLambertMaterial( { color: 0x43A7DD } );
  var planetTwo = new THREE.Mesh( geometryPlanetTwo, materialPlanet );
  scene.add( planetTwo );
  planetTwo.position.x = 10
  planetTwo.position.y = -31
  planetTwo.position.z = -5
  planets.push(planetTwo)

  // planetThree
  const geometryPlanetThree = new THREE.SphereGeometry( 8, 64, 32 );
  const materialPlanetThree = new THREE.MeshLambertMaterial( { color: 0x1FB851 } );
  var planetThree = new THREE.Mesh( geometryPlanetThree, materialPlanetThree );
  scene.add( planetThree );
  planetThree.position.x = 50
  planetThree.position.y = -4
  planetThree.position.z = 1.5
  planets.push(planetThree)

  // planetFour
  const geometryPlanetFour = new THREE.SphereGeometry( 8, 64, 32 );
  const materialPlanetFour = new THREE.MeshLambertMaterial( { color: 0xE3D21B } );
  var planetFour = new THREE.Mesh( geometryPlanetFour, materialPlanetFour );
  scene.add( planetFour );
  planetFour.position.x = 92
  planetFour.position.y = 20
  planetFour.position.z = -10
  planets.push(planetFour)

  console.log(planets)

  //

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  //renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize( sceneContainer.clientWidth, sceneContainer.clientHeight )
  //container.appendChild( renderer.domElement );
  sceneContainer.appendChild( renderer.domElement )

  stats = new Stats();
  document.querySelector("body").appendChild( stats.dom );

  /*
  * CONTROLS
  */
  setTimeout(() => {
    console.log("controls ready")
    dragControls = new DragControls( [...scene.children], camera, renderer.domElement );
    dragControls.addEventListener( 'drag', render );
    dragControls.enabled = true
  }, 1000);

  document.addEventListener( 'mousemove', onPointerMove );

  document.addEventListener("dblclick", doubleClick)

  //

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  //camera.aspect = window.innerWidth / window.innerHeight;
  camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( sceneContainer.clientWidth, sceneContainer.clientHeight );

}

function onPointerMove( event ) {
  const {top, left, width, height} = renderer.domElement.getBoundingClientRect();

  pointer.x = ( (event.clientX - left) / width ) * 2 - 1;
  pointer.y = - ( (event.clientY - top) / height ) * 2 + 1;

}

function doubleClick (event) {
  console.log(ghostObj)
  document.querySelector(".ghostinfo").innerHTML = 
  `
  <div><em>uuid</em>: ${ghostObj.uuid}</div>
  <div><em>position</em>: x = ${ghostObj.position.x}, y = ${ghostObj.position.y}, z = ${ghostObj.position.z}</div>
  <div><em>scale</em>: x = ${ghostObj.scale.x}, y = ${ghostObj.scale.y}, z = ${ghostObj.scale.z}</div>
  `
}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();
}

function render() {

  theta += 0.01;
  /*
  camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
  camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
  camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
  */
  camera.lookAt( scene.position );

  camera.updateMatrixWorld();

  // find intersections

  raycaster.setFromCamera( pointer, camera );

  let t = clock.getElapsedTime()

  mainPlanet.position.x = mainPlanet.position.x + (Math.sin(theta) * 0.005)
  mainPlanet.position.y = mainPlanet.position.y + (Math.sin(theta) * 0.005)
  
  planets[0].position.x = planets[0].position.x + (Math.sin(theta) * - 0.0125)
  planets[0].position.y = planets[0].position.y + (Math.sin(theta) * 0.0125)

  planets[1].position.x = planets[1].position.x + (Math.cos(theta) * 0.0125)
  planets[1].position.y = planets[1].position.y + (Math.cos(theta) * 0.0125)

  planets[2].position.x = planets[2].position.x + (Math.sin(theta) * 0.0125)
  planets[2].position.y = planets[2].position.y + (Math.cos(theta) * - 0.0125)
  
  planets[3].position.x = planets[3].position.x + (Math.cos(theta) * - 0.0125)
  planets[3].position.y = planets[3].position.y + (Math.sin(theta) * 0.0125)


  planets.forEach(element => {
    //let magicNumber = (Math.abs(Math.cos(t))+3.5)/3.75

    //element.position.y = element.position.y + magicNumber
    //element.position.y =  radius * Math.sin( THREE.MathUtils.degToRad( theta ) )

    /*
    element.scale.x = magicNumber
    element.scale.y = magicNumber
    element.scale.z = magicNumber
    */
  })

  const intersects = raycaster.intersectObjects( scene.children, false );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );
      ghostObj = intersects[ 0 ].object

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

  renderer.render( scene, camera );

}