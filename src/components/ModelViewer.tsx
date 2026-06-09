import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, Clone } from '@react-three/drei';

// Компонент для перехвата ошибок загрузки модели
class ErrorBoundary extends React.Component<{fallback: React.ReactNode, children: React.ReactNode}, {error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      if (React.isValidElement(this.props.fallback)) {
        return React.cloneElement(this.props.fallback as React.ReactElement<any>, { error: this.state.error });
      }
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SafeRealModel({ url }: { url: string }) {
  const [exists, setExists] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (res.ok && !res.headers.get('content-type')?.includes('text/html')) {
          setExists(true);
        } else {
          setExists(false);
        }
      })
      .catch(() => setExists(false));
  }, [url]);

  if (exists === null) return null;
  if (exists === false) throw new Error("Модель не найдена");

  return (
    <Stage environment="city" intensity={0.5}>
      <RealModel url={url} />
    </Stage>
  );
}

function RealModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Используем Clone вместо primitive для безопасного переиспользования модели из кэша
  return <Clone object={scene} />;
}

function FallbackModel({ url, error }: { url: string, error?: Error }) {
  const filename = url.split('/').pop();
  return (
    <Html center>
      <div className="bg-neutral-900/90 backdrop-blur-sm p-4 rounded-xl text-center border border-neutral-700 w-64 text-white">
        <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="font-medium mb-1">Ошибка загрузки</p>
        <p className="text-xs text-neutral-400 mb-2">
          {error?.message || "Модель не найдена"}
        </p>
        <p className="text-xs text-neutral-400">
          Загрузите файл <b>{filename}</b> в папку <b>public/models/</b>
        </p>
      </div>
    </Html>
  );
}

export default function ModelViewer({ exhibitId }: { exhibitId: string }) {
  const modelUrl = `./models/${exhibitId}.glb`;

  return (
    <Canvas shadows camera={{ position: [4, 3, 5], fov: 45 }}>
      <ErrorBoundary fallback={<FallbackModel url={modelUrl} />}>
        <Suspense fallback={<Html center><div className="text-white text-sm">Загрузка 3D...</div></Html>}>
          <SafeRealModel url={modelUrl} />
        </Suspense>
      </ErrorBoundary>
      <OrbitControls
        makeDefault 
        minAzimuthAngle={-Math.PI * 0.4}
        maxAzimuthAngle={Math.PI * 0.4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
