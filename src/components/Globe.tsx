import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TrendingRepo } from '../types';

interface GlobeProps {
  repos: TrendingRepo[];
}

// 全球主要科技城市 - 按国家/地区分组，每个国家显示top城市
const WORLD_CITIES = [
  // 美国 Top 5
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, country: 'USA' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321, country: 'USA' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'USA' },
  { name: 'Austin', lat: 30.2672, lng: -97.7431, country: 'USA' },
  // 中国 Top 5
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China' },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China' },
  { name: 'Shenzhen', lat: 22.5431, lng: 114.0579, country: 'China' },
  { name: 'Hangzhou', lat: 30.2741, lng: 120.1551, country: 'China' },
  { name: 'Chengdu', lat: 30.5728, lng: 104.0668, country: 'China' },
  // 日本 Top 3
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'Osaka', lat: 34.6937, lng: 135.5023, country: 'Japan' },
  { name: 'Kyoto', lat: 35.0116, lng: 135.7681, country: 'Japan' },
  // 韩国 Top 2
  { name: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
  { name: 'Busan', lat: 35.1796, lng: 129.0756, country: 'South Korea' },
  // 欧洲
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686, country: 'Sweden' },
  // 亚洲其他
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
  { name: 'Taipei', lat: 25.0330, lng: 121.5654, country: 'Taiwan' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, country: 'India' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
  // 其他地区
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' },
  { name: 'Vancouver', lat: 49.2827, lng: -123.1207, country: 'Canada' },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel' },
  { name: 'Sao Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
];

// 七大洲轮廓数据 - 简化版
const CONTINENTS_OUTLINE: [number, number][][] = [
  // 北美洲
  [[-168, 66], [-160, 60], [-150, 61], [-140, 60], [-130, 55], [-125, 50], [-124, 42], [-117, 32], [-105, 25], [-97, 26], [-82, 25], [-80, 30], [-75, 35], [-70, 42], [-67, 45], [-60, 47], [-55, 50], [-60, 55], [-70, 65], [-85, 72], [-120, 70], [-160, 70], [-168, 66]],
  // 南美洲
  [[-80, 10], [-75, 5], [-60, 5], [-50, 0], [-40, -10], [-38, -15], [-45, -25], [-55, -35], [-68, -55], [-75, -48], [-75, -35], [-70, -25], [-80, -5], [-80, 10]],
  // 欧洲
  [[-10, 36], [0, 38], [10, 45], [20, 40], [30, 45], [40, 42], [30, 55], [20, 62], [10, 62], [0, 55], [-10, 40], [-10, 36]],
  // 非洲
  [[-18, 28], [-5, 35], [10, 35], [32, 32], [40, 20], [50, 12], [45, 0], [35, -20], [28, -33], [18, -32], [10, -10], [0, 5], [-10, 8], [-18, 20], [-18, 28]],
  // 亚洲
  [[30, 42], [50, 38], [70, 55], [90, 52], [110, 35], [120, 22], [105, 10], [90, 22], [75, 30], [60, 28], [45, 35], [30, 42]],
  // 大洋洲
  [[115, -22], [130, -12], [150, -22], [153, -28], [145, -38], [130, -32], [115, -22]],
  // 南极洲
  [[-180, -70], [-120, -70], [-60, -72], [0, -70], [60, -68], [120, -68], [180, -70]],
  // 格陵兰
  [[-45, 60], [-25, 70], [-25, 78], [-45, 78], [-60, 70], [-45, 60]],
  // 日本
  [[130, 32], [140, 38], [145, 44], [140, 35], [130, 32]],
  // 英国
  [[-5, 50], [0, 52], [-3, 58], [-5, 50]],
  // 新西兰
  [[166, -35], [175, -42], [178, -47], [170, -42], [166, -35]],
];

// 信息流颜色 - 4种颜色（青色、蓝色、紫色、橙色）
const FLOW_COLORS = ['#00ffaa', '#4a9aff', '#a855f7', '#f97316'];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function EarthSurface() {
  const textureLoader = new THREE.TextureLoader();
  
  const earthTexture = textureLoader.load(
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  );
  const bumpTexture = textureLoader.load(
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  );
  const specularTexture = textureLoader.load(
    'https://unpkg.com/three-globe/example/img/earth-water.png'
  );
  
  return (
    <Sphere args={[2, 64, 64]}>
      <meshPhongMaterial
        map={earthTexture}
        bumpMap={bumpTexture}
        bumpScale={0.05}
        specularMap={specularTexture}
        specular={new THREE.Color(0x333333)}
        shininess={15}
      />
    </Sphere>
  );
}

function Atmosphere() {
  const cloudTexture = new THREE.TextureLoader().load(
    'https://unpkg.com/three-globe/example/img/earth-clouds.png'
  );
  
  const cloudRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (cloudRef.current) {
      // 云层缓慢旋转
      cloudRef.current.rotation.y = clock.getElapsedTime() * 0.003;
    }
  });
  
  return (
    <>
      {/* 真实云层 */}
      <mesh ref={cloudRef}>
        <Sphere args={[2.01, 64, 64]}>
          <meshPhongMaterial
            map={cloudTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </Sphere>
      </mesh>
      
      {/* 大气层发光效果 - 使用着色器 */}
      <Sphere args={[2.02, 64, 64]}>
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
          `}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* 外层大气光晕 */}
      <Sphere args={[2.03, 64, 64]}>
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(0.2, 0.5, 1.0, 0.6) * intensity;
            }
          `}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
}

// 七大洲轮廓 - 实线（70%连接）
function ContinentOutlines() {
  const lines = useMemo(() => {
    return CONTINENTS_OUTLINE.map((outline, idx) => {
      // 将轮廓点转换为3D坐标
      const allPoints = outline.map(([lng, lat]) => latLngToVector3(lat, lng, 2.01));
      const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);
      return { geometry, key: idx };
    });
  }, []);

  return (
    <group>
      {lines.map(({ geometry, key }) => (
        <line key={key} geometry={geometry}>
          <lineBasicMaterial 
            color={key < 7 ? '#2a7acc' : '#5abaff'} 
            transparent 
            opacity={0.85} 
          />
        </line>
      ))}
    </group>
  );
}

function GridLines() {
  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 5) {
        points.push(latLngToVector3(lat, lng, 2.005));
      }
      result.push(points);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, 2.005));
      }
      result.push(points);
    }
    return result;
  }, []);

  return (
    <group>
      {lines.map((points, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#1a4a6a" transparent opacity={0.35} />
          </line>
        );
      })}
    </group>
  );
}

// 城市热点标记 - 显示全球主要科技城市
function CityMarkers({ repos }: { repos: TrendingRepo[]; languageStats: Record<string, number> }) {
  // 根据仓库数量模拟城市活跃度
  const cityActivity = useMemo(() => {
    const totalRepos = repos.length;
    
    return WORLD_CITIES.map((city, idx) => {
      // 模拟活跃度 - 基于城市排名和仓库总数
      const baseActivity = Math.max(0.3, 1 - idx * 0.02);
      const activity = totalRepos > 0 ? baseActivity : 0;
      
      return {
        ...city,
        activity,
        // 模拟仓库数量分布
        repoCount: Math.floor(totalRepos * baseActivity * 0.3),
      };
    });
  }, [repos.length]);

  return (
    <group>
      {cityActivity.map((city, idx) => {
        const position = latLngToVector3(city.lat, city.lng, 2.02);
        
        return (
          <group key={idx}>
            {/* 城市多圈层脉冲环 */}
            {city.activity > 0 && (
              <MultiLayerPulseRing position={position} color="#00ffaa" delay={idx * 0.15} />
            )}
            
            {/* 城市名字 - 无阴影 */}
            {city.activity > 0 && (
              <Html position={latLngToVector3(city.lat, city.lng, 2.15)} center>
                <div className="text-[8px] whitespace-nowrap pointer-events-none font-mono tracking-wider text-center">
                  <div style={{ color: '#00ffaa' }}>{city.name.toUpperCase()}</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// 多圈层脉冲环组件
function MultiLayerPulseRing({ position, color, delay }: { position: THREE.Vector3; color: string; delay: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() + delay;
    
    // 第一圈 - 最快
    if (ring1Ref.current) {
      const t1 = (time % 1.5) / 1.5;
      const scale1 = 1 + t1 * 2;
      ring1Ref.current.scale.set(scale1, scale1, scale1);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - t1);
    }
    
    // 第二圈 - 延迟0.5秒
    if (ring2Ref.current) {
      const t2 = ((time + 0.5) % 1.5) / 1.5;
      const scale2 = 1 + t2 * 2;
      ring2Ref.current.scale.set(scale2, scale2, scale2);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - t2);
    }
    
    // 第三圈 - 延迟1秒
    if (ring3Ref.current) {
      const t3 = ((time + 1) % 1.5) / 1.5;
      const scale3 = 1 + t3 * 2;
      ring3Ref.current.scale.set(scale3, scale3, scale3);
      (ring3Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - t3);
    }
  });

  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  return (
    <group>
      {/* 第一圈 */}
      <mesh ref={ring1Ref} position={position} quaternion={quaternion}>
        <ringGeometry args={[0.02, 0.03, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* 第二圈 */}
      <mesh ref={ring2Ref} position={position} quaternion={quaternion}>
        <ringGeometry args={[0.02, 0.028, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* 第三圈 */}
      <mesh ref={ring3Ref} position={position} quaternion={quaternion}>
        <ringGeometry args={[0.02, 0.026, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 实时数据流 - 弧线流动效果，使用有限颜色
function DataFlows({ repos }: { repos: TrendingRepo[]; languageStats: Record<string, number> }) {
  const flows = useMemo(() => {
    if (repos.length === 0) return [];
    
    const result: { 
      startCity: typeof WORLD_CITIES[0]; 
      endCity: typeof WORLD_CITIES[0]; 
      color: string; 
      count: number;
      repoName: string;
    }[] = [];
    
    // 基于实际仓库创建流向
    const topRepos = repos.slice(0, 10);
    
    topRepos.forEach((repo, idx) => {
      const startIdx = idx % WORLD_CITIES.length;
      const endIdx = (idx + 5) % WORLD_CITIES.length;
      
      result.push({
        startCity: WORLD_CITIES[startIdx],
        endCity: WORLD_CITIES[endIdx],
        color: FLOW_COLORS[idx % FLOW_COLORS.length],
        count: repo.starsSince,
        repoName: repo.repositoryName,
      });
    });
    
    return result;
  }, [repos]);

  return (
    <group>
      {flows.map((flow, idx) => (
        <DataFlowLine 
          key={idx} 
          startCity={flow.startCity}
          endCity={flow.endCity}
          color={flow.color}
          delay={idx * 0.8}
          count={flow.count}
          repoName={flow.repoName}
        />
      ))}
    </group>
  );
}

function DataFlowLine({ startCity, endCity, color, delay, count, repoName }: { 
  startCity: typeof WORLD_CITIES[0];
  endCity: typeof WORLD_CITIES[0];
  color: string; 
  delay: number;
  count: number;
  repoName: string;
}) {
  const lineRef = useRef<THREE.Line>(null);
  
  const start = useMemo(() => latLngToVector3(startCity.lat, startCity.lng, 2.02), [startCity]);
  const end = useMemo(() => latLngToVector3(endCity.lat, endCity.lng, 2.02), [endCity]);
  
  // 创建弯曲的弧线
  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(2 + distance * 0.5);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(80), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  
  // 流动效果 - 线条呼吸动画
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      // 呼吸效果
      const pulse = 0.3 + Math.sin(clock.getElapsedTime() * 1.5 + delay) * 0.15;
      material.opacity = pulse;
    }
  });

  return (
    <group>
      {/* 实线弧线 */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>
      
      {/* 数据标签 - 显示仓库名 */}
      <Html position={curve.getPoint(0.5)} center>
        <div 
          className="text-[7px] whitespace-nowrap pointer-events-none font-mono px-1 py-0.5 rounded"
          style={{ 
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: `1px solid ${color}`,
            textShadow: `0 0 4px ${color}`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        >
          {repoName.slice(0, 12)} +{count}★
        </div>
      </Html>
    </group>
  );
}

// 轨道卫星
function OrbitingSatellites() {
  const satellites = useMemo(() => {
    const result = [];
    const count = 4;
    
    for (let i = 0; i < count; i++) {
      const orbitRadius = 2.5 + Math.random() * 0.5;
      const orbitTilt = (Math.random() - 0.5) * Math.PI * 0.5;
      const orbitSpeed = 0.1 + Math.random() * 0.1;
      const startAngle = Math.random() * Math.PI * 2;
      const size = 0.008 + Math.random() * 0.006;
      const color = ['#00ffaa', '#4a9aff', '#1a5a9a', '#a371f7'][i % 4];
      
      result.push({ orbitRadius, orbitTilt, orbitSpeed, startAngle, size, color });
    }
    
    return result;
  }, []);

  return (
    <group>
      {satellites.map((sat, idx) => (
        <Satellite key={idx} {...sat} />
      ))}
    </group>
  );
}

function Satellite({ orbitRadius, orbitTilt, orbitSpeed, startAngle, size, color }: {
  orbitRadius: number;
  orbitTilt: number;
  orbitSpeed: number;
  startAngle: number;
  size: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Line>(null);
  const trailPositions = useRef<THREE.Vector3[]>([]);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const angle = startAngle + clock.getElapsedTime() * orbitSpeed;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = Math.sin(angle) * Math.sin(orbitTilt) * orbitRadius * 0.3;
      
      groupRef.current.position.set(x, y, z);
      
      trailPositions.current.push(new THREE.Vector3(x, y, z));
      if (trailPositions.current.length > 30) {
        trailPositions.current.shift();
      }
      
      if (trailRef.current && trailPositions.current.length > 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints(trailPositions.current);
        trailRef.current.geometry.dispose();
        trailRef.current.geometry = geometry;
      }
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[size, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh>
          <sphereGeometry args={[size * 2, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </group>
      <line ref={trailRef}>
        <bufferGeometry />
        <lineBasicMaterial color={color} transparent opacity={0.2} />
      </line>
    </>
  );
}

function StarDust() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const count = 300;
    
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      
      const t = Math.random();
      colors.push(0.2 + t * 0.3, 0.5 + t * 0.3, 0.8 + t * 0.2);
    }
    
    return { 
      positions: new Float32Array(positions), 
      colors: new Float32Array(colors),
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} vertexColors transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function GlobeMesh({ repos }: { repos: TrendingRepo[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const languageStats = useMemo(() => {
    const stats: Record<string, number> = {};
    repos.forEach(repo => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1;
      }
    });
    return stats;
  }, [repos]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <EarthSurface />
      <Atmosphere />
      <CityMarkers repos={repos} languageStats={languageStats} />
      <DataFlows repos={repos} languageStats={languageStats} />
    </group>
  );
}

export function Globe({ repos }: GlobeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.5}
        castShadow
      />
      <pointLight
        position={[-5, 3, 5]}
        intensity={0.5}
        color="#4a9aff"
      />
      
      <GlobeMesh repos={repos} />
      <OrbitingSatellites />
      <StarDust />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI * 5 / 6}
      />
    </Canvas>
  );
}
