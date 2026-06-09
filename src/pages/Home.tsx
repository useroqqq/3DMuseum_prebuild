import MuseumPlan3D from '../components/MuseumPlan3D';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 transition-colors">
      {/* Fullscreen 3D Canvas */}
      <div className="absolute inset-0">
        <MuseumPlan3D />
      </div>

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 pointer-events-none z-10 flex justify-between items-start">
        <h1 className="text-lg md:text-xl font-medium bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-neutral-800 dark:text-neutral-100 shadow-sm pointer-events-auto border border-neutral-200 dark:border-neutral-800">
          Музей кафедры фотограмметрии
        </h1>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
