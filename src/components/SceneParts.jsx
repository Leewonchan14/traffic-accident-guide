import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ---------------------------------------------------------------------------
 * Shared scene parts used by both the driving simulator and the photo guide.
 * 1 unit = 1 m. Road runs along z; car front faces +z; the guardrail is at +x.
 * ------------------------------------------------------------------------- */

export const COLORS = {
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

/* Fixed anchors (stable identities so R3F does not re-apply them) */
export const MY_CAR = [-1.4, 0, 0]
export const OTHER_CAR = [-1.5, 0, 5.6]
export const PERSON_START = [
  [-0.2, 0, -0.9],
  [0.8, 0, -0.2],
]
export const SAFE_EVAC = [
  [4.8, 0, 1.1],
  [5.5, 0, 2.0],
]
export const DANGER_EVAC = [
  [0.45, 0, -0.3],
  [1.15, 0, 0.9],
]

/* A car built from primitives. Hazard lamps blink on all four corners. */
export function Car({ color = COLORS.myCar, hazards = false, trunk = false, brake = false, ...props }) {
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

export function Person({ target, color, active, start }) {
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

export function WarningTriangle({ visible = true }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    const s = THREE.MathUtils.damp(ref.current.scale.x, visible ? 1 : 0.001, 5, delta)
    ref.current.scale.setScalar(s)
  })
  return (
    <group ref={ref} position={[-1.4, 0, -13.5]} scale={visible ? 1 : 0.001}>
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
      {[-4, -7, -10].map((z) => (
        <mesh key={z} position={[0, 0.03, z + 13.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 1.6]} />
          <meshBasicMaterial color="#8a939f" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export function Road() {
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
      {/* lane divider (dashed) */}
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
