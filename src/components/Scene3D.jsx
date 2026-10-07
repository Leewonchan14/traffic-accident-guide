import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ---------------------------------------------------------------------------
 * Stylized reconstruction of a highway accident scene.
 * Legend: 1 unit = 1 m. Cars are stopped in the right lane; the shoulder and
 * guardrail are on the +x side. Car front faces +z, so approaching traffic
 * comes from -z, where the warning triangle is placed.
 * Distances are schematic (the real triangle goes 100 m behind the car).
 * ------------------------------------------------------------------------- */

const COLORS = {
  bg: '#0d1117',
  asphalt: '#22262d',
  shoulder: '#2b3038',
  grass: '#26382c',
  line: '#cfd6de',
  rail: '#8f99a8',
  myCar: '#dfe3e8',
  otherCar: '#41474f',
  danger: '#ff4d4d',
  hm: '#ffb020',
}

const PRESETS = {
  total: { pos: [11, 13, 17], target: [-1.3, 0.6, 1.5] },
  back: { pos: [3.6, 3.4, 11.5], target: [-1.3, 0.8, 2] },
  top: { pos: [-1.4, 22, 1.7], target: [-1.4, 0, 1.5] },
  hero: { pos: [8.5, 8.5, 13], target: [-1.3, 0.5, 1.2] },
}

/* fixed scene anchors (stable identities so R3F does not re-apply them) */
const MY_CAR = [-1.4, 0, 0]
const OTHER_CAR = [-1.5, 0, 5.6]
const PERSON_START = [
  [-0.2, 0, -0.9],
  [0.8, 0, -0.2],
]
const SAFE_EVAC = [
  [4.8, 0, 1.1],
  [5.5, 0, 2.0],
]
const DANGER_EVAC = [
  [0.45, 0, -0.3],
  [1.15, 0, 0.9],
]

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

/* A car built from primitives. Hazard lamps blink on all four corners. */
function Car({ color = COLORS.myCar, hazards = false, trunk = false, brake = false, ...props }) {
  const trunkRef = useRef()
  const hazRefs = [useRef(), useRef(), useRef(), useRef()]
  const lampRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const on = hazards && Math.floor(t / 0.45) % 2 === 0
    for (const r of hazRefs) {
      if (r.current) r.current.material.emissiveIntensity = on ? 2.4 : 0.04
    }
    if (lampRef.current) lampRef.current.intensity = on ? 1.5 : 0
    if (trunkRef.current) {
      trunkRef.current.rotation.x = THREE.MathUtils.damp(
        trunkRef.current.rotation.x,
        trunk ? 0.95 : 0,
        4,
        state.delta,
      )
    }
  })

  const wheelGeo = useMemo(() => new THREE.CylinderGeometry(0.34, 0.34, 0.24, 18), [])
  const wheelPos = [
    [-0.92, 0.34, 1.45],
    [0.92, 0.34, 1.45],
    [-0.92, 0.34, -1.45],
    [0.92, 0.34, -1.45],
  ]
  const hazPos = [
    [-0.84, 0.66, 2.16],
    [0.84, 0.66, 2.16],
    [-0.84, 0.66, -2.16],
    [0.84, 0.66, -2.16],
  ]

  return (
    <group {...props}>
      <RoundedBox args={[1.86, 0.62, 4.4]} radius={0.16} smoothness={3} position={[0, 0.62, 0]}>
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[1.62, 0.56, 2.2]} radius={0.14} smoothness={3} position={[0, 1.16, -0.25]}>
        <meshStandardMaterial color="#1b2129" metalness={0.6} roughness={0.2} />
      </RoundedBox>
      {wheelPos.map((p, i) => (
        <mesh key={i} geometry={wheelGeo} position={p} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#101318" roughness={0.9} />
        </mesh>
      ))}
      {/* headlights (front, +z) */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={`h${x}`} position={[x, 0.62, 2.19]}>
          <boxGeometry args={[0.34, 0.12, 0.06]} />
          <meshStandardMaterial color="#e9eef5" emissive="#cfe0f5" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* taillights (rear, -z) */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={`t${x}`} position={[x, 0.66, -2.21]}>
          <boxGeometry args={[0.3, 0.12, 0.06]} />
          <meshStandardMaterial
            color="#7a1818"
            emissive="#ff2b2b"
            emissiveIntensity={brake || hazards ? 1.6 : 0.35}
          />
        </mesh>
      ))}
      {/* hazard lamps on all four corners */}
      {hazPos.map((p, i) => (
        <mesh key={`hz${i}`} position={p} ref={hazRefs[i]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={COLORS.hm} emissive={COLORS.hm} emissiveIntensity={0.04} />
        </mesh>
      ))}
      <pointLight ref={lampRef} position={[0, 1.1, 0]} color={COLORS.hm} intensity={0} distance={6} />
      {/* trunk lid, hinged at its forward edge */}
      <group ref={trunkRef} position={[0, 0.92, -1.7]}>
        <RoundedBox args={[1.72, 0.09, 0.72]} radius={0.04} smoothness={2} position={[0, 0, -0.34]}>
          <meshStandardMaterial color={color} metalness={0.45} roughness={0.35} />
        </RoundedBox>
      </group>
    </group>
  )
}

function Person({ target, color, active, start }) {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) ref.current.position.set(start[0], start[1], start[2])
  }, [start])
  useFrame((_, delta) => {
    if (!ref.current || !active) return
    const p = ref.current.position
    p.x = THREE.MathUtils.damp(p.x, target[0], 3.4, delta)
    p.y = THREE.MathUtils.damp(p.y, target[1], 3.4, delta)
    p.z = THREE.MathUtils.damp(p.z, target[2], 3.4, delta)
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.21, 0.88, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.56, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#e8c39e" roughness={0.6} />
      </mesh>
    </group>
  )
}

function WarningTriangle({ visible }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    const s = THREE.MathUtils.damp(ref.current.scale.x, visible ? 1 : 0.001, 5, delta)
    ref.current.scale.setScalar(s)
  })
  return (
    <group ref={ref} position={[-1.4, 0, -13.5]} scale={0.001}>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, Math.PI]}>
        <circleGeometry args={[0.55, 3]} />
        <meshStandardMaterial color="#ff5a2e" emissive="#ff5a2e" emissiveIntensity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]}>
          <boxGeometry args={[0.06, 0.4, 0.06]} />
          <meshStandardMaterial color="#c8cdd4" />
        </mesh>
      ))}
      {/* schematic distance from the cars */}
      {[-4, -7, -10].map((z) => (
        <mesh key={z} position={[0, 0.03, z + 13.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 1.6]} />
          <meshBasicMaterial color="#8a939f" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Road() {
  const dashGeo = useMemo(() => new THREE.PlaneGeometry(0.16, 3), [])
  const dashes = useMemo(() => {
    const arr = []
    for (let z = -34; z <= 34; z += 6.5) arr.push(z)
    return arr
  }, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0, 0]}>
        <planeGeometry args={[13, 90]} />
        <meshStandardMaterial color={COLORS.asphalt} roughness={0.95} />
      </mesh>
      {/* shoulder */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.6, 0.005, 0]}>
        <planeGeometry args={[3.4, 90]} />
        <meshStandardMaterial color={COLORS.shoulder} roughness={0.95} />
      </mesh>
      {/* grass beyond the guardrail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -0.01, 0]}>
        <planeGeometry args={[18, 90]} />
        <meshStandardMaterial color={COLORS.grass} roughness={1} />
      </mesh>
      {/* lane divider (dashed) between the two lanes */}
      {dashes.map((z) => (
        <mesh key={z} geometry={dashGeo} rotation={[-Math.PI / 2, 0, 0]} position={[-3.3, 0.012, z]}>
          <meshBasicMaterial color={COLORS.line} />
        </mesh>
      ))}
      {/* solid edge lines */}
      {[0.35, -8.4].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, 0]}>
          <planeGeometry args={[0.14, 90]} />
          <meshBasicMaterial color={COLORS.line} />
        </mesh>
      ))}
      {/* guardrail */}
      {Array.from({ length: 16 }, (_, i) => -34 + i * 4.4).map((z) => (
        <mesh key={z} position={[3.5, 0.36, z]}>
          <boxGeometry args={[0.12, 0.72, 0.12]} />
          <meshStandardMaterial color="#5c646f" />
        </mesh>
      ))}
      <mesh position={[3.5, 0.62, 0]}>
        <boxGeometry args={[0.1, 0.3, 90]} />
        <meshStandardMaterial color={COLORS.rail} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* skid marks */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[-1.4 + x, 0.018, -6.4]}>
          <planeGeometry args={[0.22, 8.5]} />
          <meshBasicMaterial color="#0c0f13" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
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

/* Oncoming vehicle for the danger scenario: approaches, then a flash resets it. */
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
      {/* my car (rear) */}
      <Car position={MY_CAR} color={COLORS.myCar} hazards={step >= 1} trunk={step >= 1} />
      {/* other car (front, slightly angled) */}
      <Car position={OTHER_CAR} rotation={[0, 0.1, 0]} color={COLORS.otherCar} hazards={step >= 1} />
      <WarningTriangle visible={step >= 2} />
      <Person active={personsOut} color="#3f78d4" start={PERSON_START[0]} target={personsOut ? evacTargets[0] : PERSON_START[0]} />
      <Person active={personsOut} color="#c8874a" start={PERSON_START[1]} target={personsOut ? evacTargets[1] : PERSON_START[1]} />
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
