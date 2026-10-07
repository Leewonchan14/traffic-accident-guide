import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  COLORS,
  Car,
  MY_CAR,
  OTHER_CAR,
  Person,
  Road,
  SAFE_EVAC,
  WarningTriangle,
} from './SceneParts.jsx'
import { SHOTS, WITNESS_POS } from '../data.jsx'

/* ---------------------------------------------------------------------------
 * Photo guide scene (used by the evidence section).
 *  - variant="overview": overview with numbered shooting positions
 *  - variant="preview":  renders the exact frame the selected photo should catch
 * ------------------------------------------------------------------------- */

const SHOT_LIST = Object.entries(SHOTS) // [key, {label,pos,target,fov}]
const WITNESS_COLOR = '#8a97ad'

/* Base scene: cars stopped with hazards + triangle + evacuated occupants. */
function SceneCore({ photographer = null }) {
  const evac = useMemo(() => SAFE_EVAC, [])
  return (
    <>
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 34, 96]} />
      <hemisphereLight args={['#b8c4d8', '#14181d', 0.62]} />
      <directionalLight position={[9, 15, 7]} intensity={1.05} />
      <Road />
      <Car position={MY_CAR} color={COLORS.myCar} hazards trunk />
      <Car position={OTHER_CAR} rotation={[0, 0.1, 0]} color={COLORS.otherCar} hazards />
      <WarningTriangle visible />
      <Person active={false} color="#3f78d4" start={evac[0]} target={evac[0]} />
      <Person active={false} color="#c8874a" start={evac[1]} target={evac[1]} />
      <Person active={false} color={WITNESS_COLOR} start={WITNESS_POS} target={WITNESS_POS} />
      <ContactShadows position={[0, 0.02, 0]} scale={26} blur={2.4} far={5} opacity={0.5} resolution={256} />
      {photographer}
    </>
  )
}

/* Small camera body; its lens (+z) faces the shot target. */
function CameraProp({ shot }) {
  const ref = useRef()
  useFrame(() => {
    const g = ref.current
    if (!g) return
    g.position.set(shot.pos[0], shot.pos[1], shot.pos[2])
    g.lookAt(shot.target[0], shot.target[1], shot.target[2])
  })
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.34, 0.26, 0.22]} />
        <meshStandardMaterial color="#f2f4f7" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 20]} />
        <meshStandardMaterial color="#20262e" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.13, 0.05, 0.1]} />
        <meshStandardMaterial color="#d2373c" emissive="#d2373c" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

/* Photographer figure standing where the selected photo is taken from. */
function Photographer({ shot }) {
  const ref = useRef()
  useEffect(() => {
    if (!ref.current) return
    ref.current.position.set(shot.pos[0], 0, shot.pos[2])
    ref.current.rotation.y = Math.atan2(shot.target[0] - shot.pos[0], shot.target[2] - shot.pos[2])
  }, [shot])
  return (
    <>
      <group ref={ref}>
        <Person active={false} color="#e2b13c" start={[0, 0, 0]} target={[0, 0, 0]} />
      </group>
      <CameraProp shot={shot} />
    </>
  )
}

/* Direction cone + framing rectangle hinting what the lens covers. */
function Framing({ shot }) {
  const { coneGeo, frameGeo, apex, quat, framePos } = useMemo(() => {
    const p = new THREE.Vector3(...shot.pos)
    const t = new THREE.Vector3(...shot.target)
    const dir = t.clone().sub(p).normalize()
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)

    const len = 2.0
    const cone = new THREE.CylinderGeometry(0.05, 0.46, len, 4, 1, true)
    cone.translate(0, len / 2, 0) // apex at the local origin

    const halfH = Math.tan(((shot.fov || 55) * Math.PI) / 360) * len
    const frame = new THREE.EdgesGeometry(new THREE.PlaneGeometry(2 * halfH * (4 / 3), 2 * halfH))
    frame.rotateX(Math.PI / 2) // face along +y so it aligns with the cone axis

    const framePos = p.clone().add(dir.clone().multiplyScalar(len))
    return {
      coneGeo: cone,
      frameGeo: frame,
      apex: [p.x, p.y, p.z],
      quat,
      framePos: [framePos.x, framePos.y, framePos.z],
    }
  }, [shot])

  return (
    <group>
      <mesh geometry={coneGeo} position={apex} quaternion={quat}>
        <meshBasicMaterial color="#ff8d90" transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={frameGeo} position={framePos} quaternion={quat}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </lineSegments>
    </group>
  )
}

/* Numbered, clickable shooting positions. */
function Markers({ shotIndex, onSelect }) {
  return SHOT_LIST.map(([key, s], i) => {
    const sel = i === shotIndex
    return (
      <group key={key} position={[s.pos[0], 0, s.pos[2]]}>
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.42, 24]} />
          <meshBasicMaterial
            color={sel ? '#d2373c' : '#8a939f'}
            transparent
            opacity={sel ? 0.95 : 0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html position={[0, s.pos[1] + 0.5, 0]} center>
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`${i + 1}번 촬영 위치: ${s.label}`}
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
              sel
                ? 'border-accent bg-accent text-white'
                : 'border-white/25 bg-black/60 text-white/90 hover:border-white/70'
            }`}
          >
            {i + 1}
            {sel ? ` · ${s.label}` : ''}
          </button>
        </Html>
      </group>
    )
  })
}

/* Places the preview camera exactly at the selected shooting position. */
function ShotCamera({ shot }) {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.set(shot.pos[0], shot.pos[1], shot.pos[2])
    camera.lookAt(shot.target[0], shot.target[1], shot.target[2])
    camera.fov = shot.fov || 55
    camera.updateProjectionMatrix()
  }, [shot, camera])
  return null
}

export default function PhotoScene({ variant = 'overview', shotIndex = 0, onSelect = () => {}, active = true }) {
  const shot = SHOT_LIST[shotIndex] ? SHOT_LIST[shotIndex][1] : SHOT_LIST[0][1]

  if (variant === 'preview') {
    return (
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: shot.pos, fov: shot.fov || 55, near: 0.05, far: 200 }}
        gl={{ antialias: true, powerPreference: 'high-performance', toneMappingExposure: 1.15 }}
        aria-label={`촬영 시점 미리보기: ${shot.label}`}
      >
        <SceneCore />
        <ShotCamera shot={shot} />
      </Canvas>
    )
  }

  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [10.5, 12.5, 17.5], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-label="촬영 위치 3D 안내"
    >
      <SceneCore photographer={<Photographer key={shotIndex} shot={shot} />} />
      <Markers shotIndex={shotIndex} onSelect={onSelect} />
      <Framing shot={shot} />
      <OrbitControls
        enablePan={false}
        enableDamping
        minDistance={5}
        maxDistance={34}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[-1, 0.9, 2]}
      />
    </Canvas>
  )
}
