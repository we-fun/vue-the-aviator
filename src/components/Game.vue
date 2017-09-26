<template>
<div class="world" @mousemove="handleMouseMove">
  <renderer :obj="renderer" :size="renderSize">
    <scene :obj="scene">
      <camera :obj="camera"
        :position="ui.camera.position"></camera>

      <!-- 先注释掉这个light 效果不对 可能是three版本变化 -->
      <!--<light :obj="light1"></light>-->
      <light :obj="light2"
        :position="ui.light2.position"></light>

      <object3d :obj="sea"
        :position="ui.sea.position"
        :rotation="ui.sea.rotation"></object3d>
      <object3d :obj="sky"
        :position="ui.sky.position"
        :rotation="ui.sky.rotation"></object3d>
      <object3d :obj="airplane.mesh"
        :scale="ui.airplane.scale"
        :position="ui.airplane.position"></object3d>
      <animation :fn="loop"></animation>
    </scene>
  </renderer>
</div>
</template>

<script>
/* eslint-disable semi, comma-spacing, key-spacing */
/* eslint-disable comma-dangle, space-infix-ops, no-floating-decimal */
/* eslint-disable space-before-blocks, space-in-parens, quotes */
/* eslint-disable keyword-spacing */
/* eslint-disable space-before-function-paren */
import * as THREE from 'three'
import Airplane from './Airplane'
import { Colors } from './common'

function normalize(v, vmin, vmax, tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

export default {
  name: 'Game',

  data () {
    return {
      ui: {
        mouse: { x: 0, y: 0 },
        airplane: {
          scale: .25,
          position: { y: 100 }
        },
        sea: {
          position: { y: -600 },
          rotation: { z: 0 }
        },
        sky: {
          position: { y: -600 },
          rotation: { z: 0 }
        },
        light2: {
          position: { x: 150, y: 350, z: 350 }
        },
        camera: {
          position: { x: 0, y: 100, z: 200 }
        }
      },
      WIDTH: window.innerWidth,
      HEIGHT: window.innerHeight
    }
  },

  computed: {
    renderSize () {
      return {
        w: this.WIDTH,
        h: this.HEIGHT
      }
    }
  },

  created () {
    this.renderer = this.createRenderer()
    this.scene = this.createScene()
    this.camera = this.createCamera()
    ;[this.light1, this.light2] = this.createLights()

    this.sea = this.createSea()
    this.sky = this.createSky()
    this.airplane = this.createAirplane()
  },

  methods: {
    loop () {
      this.ui.sea.rotation.z += .005
      this.ui.sky.rotation.z += .01
      // update plane
      var targetY = normalize(this.ui.mouse.y,-.75,.75,25, 175);
      var targetX = normalize(this.ui.mouse.x,-.75,.75,-100, 100);
      this.ui.airplane.position.y = targetY;
      this.ui.airplane.position.x = targetX;
      if (this.airplane && this.airplane.propeller) this.airplane.propeller.rotation.x += 0.3;
    },
    handleMouseMove (e) {
      var tx = -1 + (event.clientX / this.WIDTH)*2;
      var ty = 1 - (event.clientY / this.HEIGHT)*2;
      this.ui.mouse = {x:tx, y:ty};
    },

    createAirplane () {
      let airplane = new Airplane();
      return airplane
    },

    createSky () {
      let mesh = new THREE.Object3D()
      mesh.name = 'sky'
      let nClouds = 20
      let clouds = []
      var stepAngle = Math.PI*2 / nClouds
      for (var i=0; i<nClouds; i++) {
        var c = this.createCloud()
        clouds.push(c)
        var a = stepAngle*i
        var h = 750 + Math.random()*200
        c.position.y = Math.sin(a)*h
        c.position.x = Math.cos(a)*h
        c.position.z = -400-Math.random()*400
        c.rotation.z = a + Math.PI/2
        var s = 1+Math.random()*2
        c.scale.set(s,s,s)
        mesh.add(c)
      }
      return mesh
    },
    createCloud () {
      let mesh = new THREE.Object3D()
      mesh.name = 'cloud'
      var geom = new THREE.CubeGeometry(20,20,20)
      var mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
      })

      var nBlocs = 3+Math.floor(Math.random()*3)
      for (var i=0; i<nBlocs; i++ ) {
        var m = new THREE.Mesh(geom.clone(), mat)
        m.position.x = i*15
        m.position.y = Math.random()*10
        m.position.z = Math.random()*10
        m.rotation.z = Math.random()*Math.PI*2
        m.rotation.y = Math.random()*Math.PI*2
        var s = .1 + Math.random()*.9
        m.scale.set(s,s,s)
        m.castShadow = true
        m.receiveShadow = true
        mesh.add(m)
      }
      return mesh
    },

    createSea () {
      var geom = new THREE.CylinderGeometry(600,600,800,40,10)
      geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2))
      var mat = new THREE.MeshPhongMaterial({
        color:Colors.blue,
        transparent:true,
        opacity:.6,
        shading:THREE.FlatShading,
      })
      var mesh = new THREE.Mesh(geom, mat)
      mesh.receiveShadow = true
      return mesh
    },

    createLights () {
      let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
      let shadowLight = new THREE.DirectionalLight(0xffffff, .9);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 1000;
      shadowLight.shadow.mapSize.width = 2048;
      shadowLight.shadow.mapSize.height = 2048;
      return [hemisphereLight, shadowLight]
    },

    createCamera () {
      let aspectRatio = this.WIDTH / this.HEIGHT
      let fieldOfView = 60
      let nearPlane = 1
      let farPlane = 10000
      let camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
        )
      return camera
    },
    createScene () {
      let scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0xf7d9aa, 100,950)

      // for threejs-inspector to work
      // https://github.com/jeromeetienne/threejs-inspector
      // if (process.env.NODE_ENV === 'development') {
      //   window.THREE = THREE
      //   window.scene = scene
      // }
      return scene
    },
    createRenderer () {
      let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.shadowMap.enabled = true
      return renderer
    }
  }
}
</script>

<style>
body { margin: 0; overflow: hidden; }
.dg.main { user-select: none; }
</style>

<style scoped>
.panel { position: absolute; right: 0 }

.world {
	position: absolute;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: -webkit-linear-gradient(#e4e0ba, #f7d9aa);
	background: linear-gradient(#e4e0ba, #f7d9aa);
}
</style>
