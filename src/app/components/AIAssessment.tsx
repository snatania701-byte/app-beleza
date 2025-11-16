"use client";

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { FacialAssessment, AssessmentSuggestion } from '@/lib/types';

interface AIAssessmentProps {
  photoUrl: string;
  onComplete: (assessment: FacialAssessment) => void;
}

export default function AIAssessment({ photoUrl, onComplete }: AIAssessmentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [assessment, setAssessment] = useState<FacialAssessment | null>(null);

  useEffect(() => {
    // Simular análise de IA
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Gerar resultado após 3 segundos
    setTimeout(() => {
      const mockAssessment: FacialAssessment = {
        skinQuality: 78,
        skinTone: 'Médio',
        faceShape: 'Oval',
        analyzedAt: new Date().toISOString(),
        suggestions: [
          {
            id: '1',
            category: 'skin',
            title: 'Remover Acne e Manchas',
            description: 'Suavize imperfeições e uniformize o tom da pele',
            isPremium: false
          },
          {
            id: '2',
            category: 'skin',
            title: 'Suavizar Rugas',
            description: 'Reduza linhas de expressão e sinais de idade',
            isPremium: false
          },
          {
            id: '3',
            category: 'hair',
            title: 'Mudar Cor do Cabelo',
            description: 'Experimente diferentes cores e tons de cabelo',
            isPremium: true
          },
          {
            id: '4',
            category: 'makeup',
            title: 'Maquiagem IA',
            description: 'Aplique maquiagem moderna e estilizada automaticamente',
            isPremium: true
          },
          {
            id: '5',
            category: 'beard',
            title: 'Adicionar Barba',
            description: 'Teste diferentes estilos de barba e bigode',
            isPremium: true
          },
          {
            id: '6',
            category: 'body',
            title: 'Ajuste Corporal',
            description: 'Modifique formato corporal e proporções',
            isPremium: false
          }
        ]
      };

      setAssessment(mockAssessment);
      setIsAnalyzing(false);
      
      // Salvar no localStorage
      localStorage.setItem('facialAssessment', JSON.stringify(mockAssessment));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (assessment) {
      onComplete(assessment);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8">
        {isAnalyzing ? (
          // Analyzing State
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-20 h-20 text-purple-500 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Analisando sua Foto
            </h1>
            <p className="text-gray-600 mb-8">
              Nossa IA está avaliando suas características faciais...
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 font-semibold">{progress}%</p>
          </div>
        ) : (
          // Results State
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
                Análise Completa!
              </h1>
              <p className="text-gray-600 text-center">
                Aqui estão suas recomendações personalizadas
              </p>
            </div>

            {/* Photo and Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <img
                  src={photoUrl}
                  alt="Your photo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stats */}
              <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Suas Características
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Qualidade da Pele</span>
                      <span className="text-purple-600 font-bold">{assessment?.skinQuality}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                        style={{ width: `${assessment?.skinQuality}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">Tom de Pele</span>
                    <span className="text-purple-600 font-bold">{assessment?.skinTone}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">Formato do Rosto</span>
                    <span className="text-pink-600 font-bold">{assessment?.faceShape}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Potencial de Melhoria</h3>
                      <p className="text-sm text-gray-600">
                        Identificamos {assessment?.suggestions.length} áreas onde você pode realçar sua beleza
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Sugestões Personalizadas
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {assessment?.suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                      suggestion.isPremium
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-800">{suggestion.title}</h3>
                      {suggestion.isPremium && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Desbloqueie Todos os Recursos</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Para acessar todas as ferramentas de transformação, incluindo maquiagem IA, 
                      mudança de cabelo e efeitos criativos, escolha um plano premium.
                    </p>
                    <button
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      Ver Planos Premium
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
