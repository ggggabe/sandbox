import React, { useRef, useState, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { useThree, useFrame, extend, Canvas } from 'react-three-fiber'

const MAXSCALE = [1.5, 1.5, 1.5]
const MINSCALE = [1, 1, 1]

extend({ EffectComposer, UnrealBloomPass, FilmPass, RenderPass })

function PostProcessing() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspectRatio = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray='passes' scene={scene} camera={camera} />
      <unrealBloomPass attachArray='passes' args={[ aspectRatio, .4, 1, .4
      ]}/>
      <filmPass attachArray='passes' args={[
        .3,
        .3,
        size.height*3,
        false
      ]} />
    </effectComposer>
  )
}

function Box (props) {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)
  const [ active, setActive] = useState(false)

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? MAXSCALE : MINSCALE }
      onClick={ e => setActive(!active) }
      onPointerOver={ e => setHover(true) }
      onPointerOut={ e => setHover(false) }
    >
      <sphereBufferGeometry attach="geometry" args={[3, 128, 128]} />
      <meshStandardMaterial attach='material' color='white' wireframe/>
    </mesh>
  )
}


const Bar = (props) => {
  return (
      <mesh {...props}>
        <boxBufferGeometry attach='geometry' args={[10, 2, 2]}/>
        <meshLambertMaterial emissive={ new THREE.Color('hsl(22, 92%, 51%)')} attach='material'/>
      </mesh>
  )
}

const Bars = (props) => {

}

export default function App() {
  return (
    <Canvas camera={{fov: 100, position: [0,0,30]}} color='#190314'>


      <mesh>
        <planeBufferGeometry attach='geometry' args={[10000, 10000]} />
        <meshStandardMaterial attach='material' color='#000000' depthTest='false' />
      </mesh>

      <Box position={[-10, 0, 10]} />
      <Box position={[10, 0, 10]} />

      {[
        -8, -4, 0, 4, 8, 12
      ].map(y => <Bar position={[0, y, 0]} key={y} />)
      }
      <PostProcessing />

    </Canvas>
  )
}
