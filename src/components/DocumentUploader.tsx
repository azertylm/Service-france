import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  FileText,
  AlertCircle,
  Sparkles,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  X,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { SampleContract } from '../types/contract';

interface DocumentUploaderProps {
  onAnalyze: (payload: {
    text?: string;
    file?: { data: string; mimeType: string; name: string };
    contractTypeHint?: string;
  }) => void;
  isLoading: boolean;
  onSelectSample: (sample: SampleContract) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onAnalyze,
  isLoading,
  onSelectSample,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'paste'>('upload');
  const [contractTypeHint, setContractTypeHint] = useState<string>('auto');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    previewUrl?: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste text state
  const [pastedText, setPastedText] = useState('');

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera on unmount or mode change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        "Impossible d'accéder à l'appareil photo. Vérifiez les autorisations de votre navigateur ou téléversez directement une photo."
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 25 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const mimeType = file.type || 'application/octet-stream';
      const isImg = mimeType.startsWith('image/');

      setSelectedFile({
        file,
        previewUrl: isImg ? result : undefined,
        base64,
        mimeType,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = () => {
    if (isLoading) return;

    if (activeMode === 'upload' && selectedFile) {
      onAnalyze({
        file: {
          data: selectedFile.base64,
          mimeType: selectedFile.mimeType,
          name: selectedFile.file.name,
        },
        contractTypeHint: contractTypeHint !== 'auto' ? contractTypeHint : undefined,
      });
    } else if (activeMode === 'camera' && capturedPhoto) {
      const base64 = capturedPhoto.split(',')[1];
      onAnalyze({
        file: {
          data: base64,
          mimeType: 'image/jpeg',
          name: 'photo-contrat.jpg',
        },
        contractTypeHint: contractTypeHint !== 'auto' ? contractTypeHint : undefined,
      });
    } else if (activeMode === 'paste' && pastedText.trim()) {
      onAnalyze({
        text: pastedText.trim(),
        contractTypeHint: contractTypeHint !== 'auto' ? contractTypeHint : undefined,
      });
    }
  };

  const canSubmit =
    (activeMode === 'upload' && selectedFile) ||
    (activeMode === 'camera' && capturedPhoto) ||
    (activeMode === 'paste' && pastedText.trim().length > 30);

  return (
    <div className="space-y-8">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif-title">
          Ne signez plus jamais les yeux fermés.
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Baux d’habitation, devis d’artisans, assurances ou abonnements : téléversez votre document
          ou photographiez-le. Obtenez en quelques secondes une fiche d'analyse en français simple,
          dépourvue de jargon.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden max-w-3xl mx-auto">
        {/* Mode selector tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 text-xs font-medium">
          <button
            onClick={() => {
              stopCamera();
              setActiveMode('upload');
            }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeMode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-slate-700" />
            <span>Téléverser (PDF / Image)</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('camera');
              startCamera();
            }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeMode === 'camera'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-slate-700" />
            <span>Prendre en photo</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveMode('paste');
            }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeMode === 'paste'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-700" />
            <span>Coller le texte</span>
          </button>
        </div>

        {/* Contract Type Hint selector */}
        <div className="px-6 py-3 bg-slate-50/40 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label htmlFor="contract-hint" className="text-slate-600 font-medium">
            Type de document (recommandé pour affiner la grille légale) :
          </label>
          <select
            id="contract-hint"
            value={contractTypeHint}
            onChange={(e) => setContractTypeHint(e.target.value)}
            className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="auto">Détection automatique</option>
            <option value="Bail de location d'habitation">Bail d'habitation (Loi de 1989)</option>
            <option value="Devis d'artisan ou travaux">Devis de travaux / artisan</option>
            <option value="Contrat d'assurance">Contrat d'assurance (Habitation, Auto, etc.)</option>
            <option value="Conditions Générales / Abonnement">Abonnement / Salle de sport / CGV</option>
            <option value="Prestation de services / Freelance">Contrat de prestation / Freelance</option>
          </select>
        </div>

        {/* Content body based on activeMode */}
        <div className="p-6">
          {/* MODE 1: FILE UPLOAD */}
          {activeMode === 'upload' && (
            <div>
              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp,image/jpg,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-700 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Glissez votre fichier ici ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Formats acceptés : PDF, Photos (JPG, PNG), ou Fichiers texte — jusqu'à 25 Mo
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
                    <span>PDF scanné ou natif</span>
                    <span>·</span>
                    <span>Photos de pages physiques</span>
                    <span>·</span>
                    <span>Analyse confidentielle</span>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedFile.previewUrl ? (
                      <img
                        src={selectedFile.previewUrl}
                        alt="Aperçu"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                        {selectedFile.file.name.split('.').pop() || 'DOC'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 truncate max-w-xs sm:max-w-md">
                        {selectedFile.file.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.file.size / 1024 / 1024).toFixed(2)} Mo · Prêt pour analyse
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Changer de fichier"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: CAMERA CAPTURE */}
          {activeMode === 'camera' && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Accès caméra non disponible</p>
                    <p className="mt-1">{cameraError}</p>
                    <button
                      onClick={() => setActiveMode('upload')}
                      className="mt-2 text-slate-900 underline font-medium"
                    >
                      Basculer vers le téléversement de fichier
                    </button>
                  </div>
                </div>
              ) : capturedPhoto ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-900 flex items-center justify-center">
                    <img
                      src={capturedPhoto}
                      alt="Photo capturée"
                      className="max-h-72 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Photo capturée avec succès
                    </span>
                    <button
                      onClick={() => startCamera()}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reprendre la photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder overlay */}
                    <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-lg pointer-events-none flex items-center justify-center">
                      <span className="bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded">
                        Cadrez le texte ou la page du contrat
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Prendre la photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: PASTE TEXT */}
          {activeMode === 'paste' && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Copiez-collez ici le texte intégral de votre bail, devis, conditions générales ou clauses particulières..."
                  rows={8}
                  className="w-full p-3.5 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed resize-y"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5 px-1">
                  <span>
                    {pastedText.length > 0 ? (
                      <span className="font-mono tabular-nums text-slate-600">
                        {pastedText.length} caractères
                      </span>
                    ) : (
                      'Minimum 30 caractères'
                    )}
                  </span>
                  {pastedText.length > 0 && (
                    <button
                      onClick={() => setPastedText('')}
                      className="text-slate-400 hover:text-slate-700 underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-slate-400" />
              <span>Diagnostic gratuit, indépendant et immédiat</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                canSubmit && !isLoading
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Analyse en cours par ClairContrat...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Décoder ce contrat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Test Samples Section */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Ou testez instantanément avec un contrat type du quotidien :
            </h3>
            <p className="text-xs text-slate-500">
              Modèles réels préchargés contenant des clauses pièges courantes pour voir la fiche en action.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_CONTRACTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="p-3.5 bg-white border border-slate-200 hover:border-slate-400 rounded-xl cursor-pointer transition-all hover:shadow-xs group text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">
                  {sample.category}
                </span>
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-mono tabular-nums">
                  {sample.knownTrapsCount} pièges identifiés
                </span>
              </div>
              <h4 className="font-semibold text-slate-900 text-xs mt-1.5 group-hover:text-slate-700 transition-colors">
                {sample.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {sample.shortDesc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="group-hover:underline">Charger et analyser ce contrat</span>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
