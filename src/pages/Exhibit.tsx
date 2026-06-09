import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { exhibits } from '../data/exhibits';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ModelViewer from '../components/ModelViewer';
import AudioPlayer from '../components/AudioPlayer';
import ReactMarkdown from 'react-markdown';
import ThemeToggle from '../components/ThemeToggle';

export default function Exhibit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exhibit = id ? exhibits[id] : null;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  const [detailedDescription, setDetailedDescription] = useState<string | null>(null);
  const [descriptionLoading, setDescriptionLoading] = useState(true);

  // Use memo to cache the valid exhibits list (no groups)
  const validExhibits = useMemo(() => Object.values(exhibits).filter(e => !e.isGroup && (!e.isHidden || e.parentId)), []);
  const currentGlobalIndex = validExhibits.findIndex(e => e.id === id);

  useEffect(() => {
    if (!exhibit) return;
	setCurrentPhotoIndex(0);
    setDescriptionLoading(true);
    fetch(`./descriptions/${exhibit.id}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        setDetailedDescription(text);
        setDescriptionLoading(false);
      })
      .catch(() => {
        setDetailedDescription(null);
        setDescriptionLoading(false);
      });
  }, [exhibit?.id]);

  const goToPrevExhibit = () => {
    if (currentGlobalIndex === -1) return;
    const prevEx = validExhibits[(currentGlobalIndex - 1 + validExhibits.length) % validExhibits.length];
    navigate(`/exhibit/${prevEx.id}`);
  };

  const goToNextExhibit = () => {
    if (currentGlobalIndex === -1) return;
    const nextEx = validExhibits[(currentGlobalIndex + 1) % validExhibits.length];
    navigate(`/exhibit/${nextEx.id}`);
  };

  const handleImageError = (photoSrc: string) => {
    setFailedImages(prev => new Set(prev).add(photoSrc));
  };

  if (!exhibit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Экспонат не найден</h2>
          <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Вернуться
          </Link>
        </div>
      </div>
    );
  }

  const backLink = exhibit.parentId ? `/group/${exhibit.parentId}` : "/";
  const backText = exhibit.parentId ? "Назад к выбору" : "К плану музея";

  const currentPhoto = exhibit.photos[currentPhotoIndex];
  const hasMultiplePhotos = exhibit.photos.length > 1;

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % exhibit.photos.length);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + exhibit.photos.length) % exhibit.photos.length);
  };

  const nextFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (fullscreenIndex !== null) {
      setFullscreenIndex((prev) => (prev! + 1) % exhibit.photos.length);
    }
  };

  const prevFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (fullscreenIndex !== null) {
      setFullscreenIndex((prev) => (prev! - 1 + exhibit.photos.length) % exhibit.photos.length);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={backLink} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{backText}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800">
               <button onClick={goToPrevExhibit} className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white" title="Предыдущий"><ChevronLeft className="w-5 h-5" /></button>
               <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider hidden sm:block">Экспонаты</span>
               <button onClick={goToNextExhibit} className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white" title="Следующий"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* Title & Description */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors">{exhibit.title}</h1>
          <div className="max-w-md">
            <AudioPlayer key={exhibit.id} exhibitId={exhibit.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: 3D Model & Detailed Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col min-h-[500px] md:min-h-[600px] transition-colors">
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex justify-between items-center transition-colors">
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Интерактивная 3D-модель</h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-500">Вращайте мышью</span>
              </div>
              <div className="flex-1 w-full bg-neutral-900 dark:bg-black cursor-move relative transition-colors">
                <ModelViewer key={exhibit.id} exhibitId={exhibit.id} />
              </div>
            </div>

            {/* Detailed Description Section (Rich Text) */}
            <div>
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                {descriptionLoading ? (
                  <p className="text-neutral-500 animate-pulse">Загрузка описания...</p>
                ) : (
                  <ReactMarkdown>
                    {detailedDescription || 
                      `Описание отсутствует. Загрузите файл **${exhibit.id}.md** в папку **public/descriptions/**`
                    }
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Photos Gallery (Carousel) */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white transition-colors">Фотографии</h3>
            
            {exhibit.photos.length > 0 ? (
              <div className="flex flex-col gap-4">
                {/* Main Carousel Image */}
                <div 
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200 shadow-sm group ${!failedImages.has(currentPhoto) ? 'cursor-pointer' : ''}`}
                  onClick={() => !failedImages.has(currentPhoto) && setFullscreenIndex(currentPhotoIndex)}
                >
                  {!failedImages.has(currentPhoto) ? (
                    <>
                      <img 
                        src={currentPhoto} 
                        alt={`${exhibit.title} - Фото ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => handleImageError(currentPhoto)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-sm text-center p-4">
                      <span className="font-medium mb-1">Нет фото</span>
                      <span className="text-xs break-all">Загрузите {currentPhoto.split('/').pop()} в public/images/</span>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {hasMultiplePhotos && (
                    <>
                      <button 
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Photo Counter */}
                  {hasMultiplePhotos && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                      {currentPhotoIndex + 1} / {exhibit.photos.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {hasMultiplePhotos && (
                  <div className="grid grid-cols-4 gap-2">
                    {exhibit.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentPhotoIndex === idx ? 'border-blue-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        {!failedImages.has(photo) ? (
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                            <span className="text-[10px]">Нет</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-neutral-100 rounded-2xl aspect-[4/3] flex items-center justify-center text-neutral-500">
                Нет фотографий
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Fullscreen Image Modal */}
      {fullscreenIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 cursor-pointer backdrop-blur-sm"
          onClick={() => setFullscreenIndex(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); setFullscreenIndex(null); }}
          >
            <X className="w-8 h-8" />
          </button>

          {hasMultiplePhotos && (
            <button 
              onClick={prevFullscreen}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <img 
            src={exhibit.photos[fullscreenIndex]} 
            alt="Полноэкранное фото" 
            className="max-w-full max-h-full object-contain cursor-default rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />

          {hasMultiplePhotos && (
            <button 
              onClick={nextFullscreen}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {hasMultiplePhotos && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
              {fullscreenIndex + 1} из {exhibit.photos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
