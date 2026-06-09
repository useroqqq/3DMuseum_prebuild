import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, Grid, Clone } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { exhibits, Exhibit } from '../data/exhibits';

// Компонент для перехвата ошибок загрузки модели
class ErrorBoundary extends React.Component<{fallback: React.ReactNode, children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
      return this.props.children;
  }
}

function SafeLidarModel() {
  const [exists, setExists] = useState<boolean | null>(null);

  React.useEffect(() => {
    fetch('./models/room.glb', { method: 'HEAD' })
      .then(res => {
        if (res.ok && !res.headers.get('content-type')?.includes('text/html')) {
          setExists(true);
        } else {
          setExists(false);
        }
      })
      .catch(() => setExists(false));
  }, []);

  if (exists === null) return null;
  if (exists === false) throw new Error("Модель не найдена");

  return <LidarModel />;
}

// Загрузчик LiDAR скана
function LidarModel() {
  const { scene } = useGLTF('./models/room.glb');
  return <Clone object={scene} />;
}

// Заглушка, если файл room.glb еще не загружен
function FallbackRoom() {
  return (
    <group>
      <Grid infiniteGrid fadeDistance={20} sectionColor="#888" cellColor="#ccc" />
    </group>
  );
}

// 3D Маркер экспоната
function Marker({ exhibit, onClick }: { exhibit: Exhibit; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={exhibit.position3D}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#3b82f6" : "#ef4444"} 
          roughness={0.2} 
          metalness={0.8} 
          emissive={hovered ? "#3b82f6" : "#ef4444"}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Пульсирующее кольцо вокруг маркера */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial color={hovered ? "#3b82f6" : "#ef4444"} transparent opacity={0.5} />
      </mesh>

      <Html position={[0, 0.3, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
        <div className={`transition-all duration-300 ${hovered ? 'scale-110 translate-y-[-4px]' : 'scale-100'}`}>
          <div className="bg-neutral-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl border border-white/10 pointer-events-none">
            {exhibit.title}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900/90 rotate-45 border-r border-b border-white/10"></div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function MuseumPlan3D() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 transition-colors relative">
      {/* 
        Позиция камеры задается здесь в свойстве camera={{ position: [x, y, z] }}
        Измените значения в массиве [-8, 6, 0], чтобы поменять начальный ракурс:
        x - влево/вправо
        y - высота
        z - ближе/дальше 
      */}
      <Canvas camera={{ position: [-8, 6, 0], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <ErrorBoundary fallback={<FallbackRoom />}>
          <Suspense fallback={<FallbackRoom />}>
            <SafeLidarModel />
          </Suspense>
        </ErrorBoundary>

        {Object.values(exhibits)
          .filter(exhibit => !exhibit.isHidden)
          .map((exhibit) => (
            <Marker 
              key={exhibit.id} 
              exhibit={exhibit} 
              onClick={() => {
                if (exhibit.isGroup) {
                  navigate(`/group/${exhibit.id}`);
                } else {
                  navigate(`/exhibit/${exhibit.id}`);
                }
              }} 
            />
        ))}

        <OrbitControls 
          makeDefault 
          maxPolarAngle={Math.PI / 2 + 0.1} // Не даем камере сильно уходить под пол
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Вращайте сцену мышью и нажимайте на маркеры
        </div>
      </div>
    </div>
  );
}
