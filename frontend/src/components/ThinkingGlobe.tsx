import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { KnowledgeNode, Connection, AnswerCore, ViewMode, ClusteringMode } from '../types';

interface ThinkingGlobeProps {
  nodes: KnowledgeNode[];
  connections: Connection[];
  answerCore: AnswerCore | null;
  viewMode: ViewMode;
  clusteringMode: ClusteringMode;
  onNodeClick: (node: KnowledgeNode) => void;
  onNodeHover: (node: KnowledgeNode | null) => void;
}

export function ThinkingGlobe({
  nodes,
  connections,
  answerCore,
  viewMode,
  clusteringMode,
  onNodeClick,
  onNodeHover,
}: ThinkingGlobeProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Background */}
        <color attach="background" args={['#050810']} />
        <fog attach="fog" args={['#050810', 10, 50]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#00d4ff" />

        {/* Stars background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Main Scene */}
        <GlobeScene
          nodes={nodes}
          connections={connections}
          answerCore={answerCore}
          viewMode={viewMode}
          clusteringMode={clusteringMode}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
        />

        {/* Camera Controls */}
        <CameraController viewMode={viewMode} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={40}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

// Camera controller to animate camera based on view mode
function CameraController({ viewMode }: { viewMode: ViewMode }) {
  const { camera } = useThree();

  useEffect(() => {
    if (viewMode === 'zooming' || viewMode === 'thinking') {
      // Zoom in smoothly
      const targetPosition = new THREE.Vector3(0, 0, 10);
      const startPosition = camera.position.clone();
      let progress = 0;

      const animate = () => {
        progress += 0.02;
        if (progress < 1) {
          camera.position.lerpVectors(startPosition, targetPosition, progress);
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [viewMode, camera]);

  return null;
}

function GlobeScene({
  nodes,
  connections,
  answerCore,
  viewMode,
  clusteringMode,
  onNodeClick,
  onNodeHover,
}: ThinkingGlobeProps) {
  return (
    <group>
      {/* Outer Globe Shell with grid */}
      <GlobeShell viewMode={viewMode} />

      {/* Answer Core in the center */}
      {answerCore && <AnswerCoreBox answerCore={answerCore} viewMode={viewMode} />}

      {/* Knowledge Nodes */}
      <NodesLayer
        nodes={nodes}
        clusteringMode={clusteringMode}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
      />

      {/* Connection Lines */}
      <ConnectionsLayer connections={connections} nodes={nodes} />

      {/* Energy particles */}
      {viewMode === 'thinking' || viewMode === 'generating' ? <EnergyParticles /> : null}
    </group>
  );
}

// Animated globe shell
function GlobeShell({ viewMode }: { viewMode: ViewMode }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.LineSegments>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Slow rotation when idle
    if (meshRef.current && viewMode === 'idle') {
      meshRef.current.rotation.y = time * 0.05;
    }

    if (gridRef.current) {
      gridRef.current.rotation.y = time * 0.03;
      gridRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    // Pulse effect when thinking
    if (innerGlowRef.current && (viewMode === 'thinking' || viewMode === 'generating')) {
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      innerGlowRef.current.scale.setScalar(pulse);
    }
  });

  const isIdle = viewMode === 'idle';
  const opacity = isIdle ? 0.15 : 0.03;

  return (
    <group>
      {/* Outer sphere */}
      <Sphere ref={meshRef} args={[6, 64, 64]}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={opacity}
          wireframe={false}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Grid wireframe */}
      <lineSegments ref={gridRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(6, 3)]} />
        <lineBasicMaterial
          color="#00d4ff"
          transparent
          opacity={isIdle ? 0.2 : 0.08}
          linewidth={1}
        />
      </lineSegments>

      {/* Inner glow sphere */}
      <Sphere ref={innerGlowRef} args={[5.5, 32, 32]}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Energy rings */}
      {!isIdle && (
        <>
          <EnergyRing radius={6.5} color="#00d4ff" speed={1} />
          <EnergyRing radius={7} color="#a855f7" speed={-0.8} />
          <EnergyRing radius={7.5} color="#10b981" speed={1.2} />
        </>
      )}
    </group>
  );
}

// Energy ring that rotates around the globe
function EnergyRing({ radius, color, speed }: { radius: number; color: string; speed: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
      ringRef.current.rotation.x = Math.PI / 2;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

// Answer core in the center
function AnswerCoreBox({ answerCore, viewMode }: { answerCore: AnswerCore; viewMode: ViewMode }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
    }

    if (glowRef.current && answerCore.isGenerating) {
      const pulse = 1 + Math.sin(time * 3) * 0.2;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const isVisible = viewMode !== 'idle';

  return (
    <group>
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Main box */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 1.8, 0.15]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
          metalness={0.8}
          roughness={0.2}
        />
        {isVisible && (
          <Html center distanceFactor={10} zIndexRange={[0, 0]}>
            <div className="bg-space-800/95 backdrop-blur-xl border border-cyber-blue/50 rounded-xl p-6 max-w-lg pointer-events-none shadow-neon-blue">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse" />
                <span className="text-xs text-cyber-blue/70 font-medium uppercase tracking-wider">
                  Answer Core
                </span>
              </div>
              <div className="text-sm text-white leading-relaxed">
                {answerCore.text || 'Initializing reasoning process...'}
              </div>
              {answerCore.isGenerating && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse delay-75" />
                    <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse delay-150" />
                  </div>
                  <span className="text-xs text-cyber-blue/70">
                    Processing step {answerCore.currentStep} of {answerCore.totalSteps}
                  </span>
                </div>
              )}
            </div>
          </Html>
        )}
      </mesh>

      {/* Corner accents */}
      {isVisible && (
        <>
          <mesh position={[1.3, 0.95, 0.1]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#00d4ff" />
          </mesh>
          <mesh position={[-1.3, 0.95, 0.1]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#00d4ff" />
          </mesh>
          <mesh position={[1.3, -0.95, 0.1]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#00d4ff" />
          </mesh>
          <mesh position={[-1.3, -0.95, 0.1]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#00d4ff" />
          </mesh>
        </>
      )}
    </group>
  );
}

// Nodes layer
function NodesLayer({
  nodes,
  clusteringMode,
  onNodeClick,
  onNodeHover,
}: {
  nodes: KnowledgeNode[];
  clusteringMode: ClusteringMode;
  onNodeClick: (node: KnowledgeNode) => void;
  onNodeHover: (node: KnowledgeNode | null) => void;
}) {
  return (
    <group>
      {nodes.map((node) => (
        <KnowledgeNodeMesh
          key={node.id}
          node={node}
          clusteringMode={clusteringMode}
          onClick={() => onNodeClick(node)}
          onPointerOver={() => onNodeHover(node)}
          onPointerOut={() => onNodeHover(null)}
        />
      ))}
    </group>
  );
}

// Individual knowledge node
function KnowledgeNodeMesh({
  node,
  clusteringMode,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  node: KnowledgeNode;
  clusteringMode: ClusteringMode;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { color, emissiveIntensity } = useMemo(() => {
    let baseColor = '#666666';

    if (clusteringMode === 'tiers') {
      switch (node.tier) {
        case 1: baseColor = '#10b981'; break;
        case 2: baseColor = '#00d4ff'; break;
        default: baseColor = '#a855f7';
      }
    } else if (clusteringMode === 'roles') {
      switch (node.role) {
        case 'principle': baseColor = '#fbbf24'; break;
        case 'fact': baseColor = '#00d4ff'; break;
        case 'example': baseColor = '#10b981'; break;
        case 'analogy': baseColor = '#a855f7'; break;
      }
    } else {
      baseColor = node.isActive ? '#00d4ff' : '#666666';
    }

    return {
      color: baseColor,
      emissiveIntensity: node.isActive ? 0.8 : 0.3,
    };
  }, [node.tier, node.role, node.isActive, clusteringMode]);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect when active
      if (node.isActive) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + node.position[0]) * 0.15;
        meshRef.current.scale.setScalar(pulse);
      }

      // Subtle floating motion
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.05;
    }

    if (glowRef.current && node.isActive) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const nodeSize = node.isActive ? 0.2 : 0.15;
  const opacity = node.isActive ? 1 : 0.4;

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      {/* Glow effect */}
      {node.isActive && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[nodeSize * 2, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Main node sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onPointerOver();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onPointerOut();
        }}
      >
        <sphereGeometry args={[nodeSize, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-space-800/98 backdrop-blur-md border border-cyber-blue/50 rounded-lg px-4 py-2 pointer-events-none shadow-neon-blue whitespace-nowrap max-w-xs">
            <div className="text-xs text-cyber-blue font-semibold mb-1">{node.title}</div>
            <div className="text-xs text-white/60">{node.role}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection lines between nodes
function ConnectionsLayer({
  connections,
  nodes,
}: {
  connections: Connection[];
  nodes: KnowledgeNode[];
}) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, KnowledgeNode>();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  return (
    <group>
      {connections.map((connection, index) => {
        const fromNode = nodeMap.get(connection.from);

        // Handle connections to answer core
        if (connection.to === 'answer-core') {
          if (!fromNode) return null;
          return (
            <ConnectionLine
              key={`${connection.from}-core-${index}`}
              from={fromNode.position}
              to={[0, 0, 0]}
              isActive={connection.isActive}
              strength={connection.strength}
            />
          );
        }

        const toNode = nodeMap.get(connection.to);
        if (!fromNode || !toNode) return null;

        return (
          <ConnectionLine
            key={`${connection.from}-${connection.to}-${index}`}
            from={fromNode.position}
            to={toNode.position}
            isActive={connection.isActive}
            strength={connection.strength}
          />
        );
      })}
    </group>
  );
}

// Individual connection line
function ConnectionLine({
  from,
  to,
  isActive,
  strength,
}: {
  from: [number, number, number];
  to: [number, number, number];
  isActive: boolean;
  strength: number;
}) {
  const points = useMemo(() => [from, to], [from, to]);

  return (
    <Line
      points={points}
      color={isActive ? '#00d4ff' : '#444444'}
      lineWidth={isActive ? 2 : 1}
      transparent
      opacity={isActive ? strength * 0.8 : 0.15}
      dashed={!isActive}
      dashScale={50}
      dashSize={0.1}
      gapSize={0.05}
    />
  );
}

// Energy particles for thinking animation
function EnergyParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(200 * 3);

    for (let i = 0; i < 200; i++) {
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
