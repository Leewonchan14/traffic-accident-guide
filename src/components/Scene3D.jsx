import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  COLORS,
  Car,
  DANGER_EVAC,
  MY_CAR,
  OTHER_CAR,
  PERSON_START,
  Person,
  Road,
  SAFE_EVAC,
  WarningTriangle,
} from './SceneParts.jsx'

/* Simulator scene: hazard lights, evacuation, warning triangle, danger car.
   Shared geometry/vehicles live in SceneParts.jsx. */

const PRESETS = {
  total: { pos: [11, 13, 17], target: [-1.3, 0.6, 1.5] },
  back: { pos: [3.6, 3.4, 11.5], target: [-1.3, 0.8, 2] },
  top: { pos: [-1.4, 22, 1.7], target: [-1.4, 0, 1.5] },
  hero: { pos: [8.5, 8.5, 13], target: [-1.3, 0.5, 1.2] },
}

function CameraRig({ preset, controlsRef }) {
  const camera = useThree((s) => s.camera)
  const anim = useRef({ t: 1, from: new THREE.Vector3(), fromT: new THREE.Vector3() })

  useEffect(() => {
    const p = PRESETS[preset] || PRESETS.total
    anim.current.from.copy(camera.position)
    anim.current.fromT.copy(controlsRef.current ? controlsRef.current.target : new THREE.Vector3())
    anim.current.t = 0
    anim.current.to = new THREE.Vector3(...p.pos)
    anim.current.toT = new THREE.Vector3(...p.target)
  }, [preset, camera, controlsRef])

  useFrame((_, delta) => {
    const a = anim.current
    if (a.t >= 1) return
    a.t = Math.min(1, a.t + delta / 1.2)
    const e = a.t < 0.5 ? 2 * a.t * a.t : 1 - Math.pow(-2 * a.t + 2, 2) / 2
    camera.position.lerpVectors(a.from, a.to, e)
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(a.fromT, a.toT, e)
      controlsRef.current.update()
    }
  })
  return null
}

/* Red translucent warning zone behind the stopped cars (danger mode). */
function DangerZone({ active }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const base = active ? 0.42 + Math.sin(t * 2.4) * 0.1 : 0
    ref.current.material.opacity = THREE.MathUtils.damp(ref.current.material.opacity, base, 4, state.delta)
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[-1.4, 0.03, -13]}>
      <planeGeometry args={[3.5, 26]} />
      <meshBasicMaterial color={COLORS.danger} transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

/* Oncoming vehicle for the danger scenario. */
function DangerCar({ active, onHit }) {
  const ref = useRef()
  const state = useRef({ z: -120, cd: 0 })
  useFrame((_, delta) => {
    if (!ref.current) return
    const s = state.current
    if (!active) {
      s.z = -120
      ref.current.position.z = -120
      return
    }
    s.z += 15 * delta
    if (s.cd > 0) s.cd -= delta
    if (s.z > -3.6 && s.cd <= 0) {
      onHit()
      s.cd = 4
    }
    if (s.z > 7) s.z = -120
    ref.current.position.z = s.z
  })
  return (
    <group ref={ref} position={[-1.4, 0, -120]}>
      <Car color="#5a6572" brake />
    </group>
  )
}

function Scene({ step, danger, preset, onHit, autoRotate = false, labels = true }) {
  const controlsRef = useRef()
  const personsOut = step >= 3
  const evacTargets = danger ? DANGER_EVAC : SAFE_EVAC
  const beacon = step >= 4

  return (
    <>
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 34, 96]} />
      <hemisphereLight args={['#b8c4d8', '#14181d', 0.62]} />
      <directionalLight position={[9, 15, 7]} intensity={1.05} />
      <Road />
      <DangerZone active={danger && step >= 1} />
      <Car position={MY_CAR} color={COLORS.myCar} hazards={step >= 1} trunk={step >= 1} />
      <Car position={OTHER_CAR} rotation={[0, 0.1, 0]} color={COLORS.otherCar} hazards={step >= 1} />
      <WarningTriangle visible={step >= 2} />
      <Person
        active={personsOut}
        color="#3f78d4"
        start={PERSON_START[0]}
        target={personsOut ? evacTargets[0] : PERSON_START[0]}
      />
      <Person
        active={personsOut}
        color="#c8874a"
        start={PERSON_START[1]}
        target={personsOut ? evacTargets[1] : PERSON_START[1]}
      />
      <DangerCar active={danger} onHit={onHit} />
      <ContactShadows position={[0, 0.02, 0]} scale={26} blur={2.4} far={5} opacity={0.5} resolution={256} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        autoRotate={autoRotate}
        autoRotateSpeed={0.55}
        minDistance={4}
        maxDistance={40}
        minPolarAngle={0.04}
        maxPolarAngle={Math.PI / 2 - 0.06}
        target={[-1.3, 0.6, 1.5]}
      />
      <CameraRig preset={preset} controlsRef={controlsRef} />

      {/* labels */}
      {labels && step >= 2 && (
        <Html position={[-1.4, 1.5, -13.5]} center className="pointer-events-none">
          <span className="whitespace-nowrap rounded-full border border-[#ff8d90]/40 bg-[#25191b]/90 px-3 py-1 text-[11.5px] font-bold text-[#ffb4b6]">
            안전삼각대 · 차량 뒤 100m 지점
          </span>
        </Html>
      )}
      {labels && personsOut && !danger && (
        <Html position={[5.1, 2.2, 1.5]} center className="pointer-events-none">
          <span className="whitespace-nowrap rounded-full border border-greenink/40 bg-[#0f2018]/90 px-3 py-1 text-[11.5px] font-bold text-[#7fe0af]">
            가드레일 밖 대피 · 안전
          </span>
        </Html>
      )}
      {labels && personsOut && danger && (
        <Html position={[0.8, 2.2, 0.3]} center className="pointer-events-none">
          <span className="whitespace-nowrap rounded-full border border-[#ff4d4d]/50 bg-[#25191b]/95 px-3 py-1 text-[11.5px] font-bold text-[#ff9a9c]">
            차로 위 대기 · 위험
          </span>
        </Html>
      )}
      {labels && beacon && (
        <Html position={danger ? [0.8, 3.2, 0.3] : [5.1, 3.2, 1.5]} center className="pointer-events-none">
          <span className="whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11.5px] font-bold text-white">
            112 · 119 신고
          </span>
        </Html>
      )}
    </>
  )
}

export default function Scene3D({
  step = 0,
  danger = false,
  preset = 'total',
  onHit = () => {},
  active = true,
  autoRotate = false,
  labels = true,
  dpr = [1, 1.75],
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 30)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: PRESETS[preset] ? PRESETS[preset].pos : PRESETS.total.pos, fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-label="교통사고 대처 3D 시뮬레이션"
    >
      {ready && (
        <Scene step={step} danger={danger} preset={preset} onHit={onHit} autoRotate={autoRotate} labels={labels} />
      )}
    </Canvas>
  )
}
