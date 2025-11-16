"use client";

import { useState } from 'react';
import { 
  Sparkles, Wand2, Palette, Scissors, Smile, User, 
  Image as ImageIcon, Settings, Lock, Crown, Menu, X
} from 'lucide-react';
import { User as UserType } from '@/lib/types';
import AcneRemovalTool from './AcneRemovalTool';

interface EditorScreenProps {
  user: UserType;
  photoUrl: string;
}

export default function EditorScreen({ user, photoUrl }: EditorScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('free');
  const [showMenu, setShowMenu] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoUrl);

  const freeTools = [
    { id: 'acne', name: 'Remover Acne', icon: Sparkles, description: 'Remove manchas e imperfeições' },
    { id: 'wrinkles', name: 'Suavizar Rugas', icon: Wand2, description: 'Reduz linhas de expressão' },
    { id: 'brightness', name: 'Ajustar Brilho', icon: Palette, description: 'Controles finos de cor' },
    { id: 'features', name: 'Ajustar Feições', icon: User, description: 'Aumentar/diminuir características' },
    { id: 'body', name: 'Formato Corporal', icon: User, description: 'Ajuste de proporções' },
    { id: 'teeth', name: 'Clarear Dentes', icon: Smile, description: 'Clareamento automático' },
    { id: 'auto', name: 'Retoque Automático', icon: Wand2, description: 'Melhoria com 1 toque' }
  ];

  const premiumTools = [
    { id: 'hair-color', name: 'Cor do Cabelo', icon: Palette, description: 'Mude a cor do cabelo', locked: !user.isPremium },
    { id: 'hairstyle', name: 'Penteado', icon: Scissors, description: 'Altere o estilo', locked: !user.isPremium },
    { id: 'beard', name: 'Barba/Bigode', icon: User, description: 'Adicione ou modifique', locked: !user.isPremium },
    { id: 'makeup', name: 'Maquiagem IA', icon: Sparkles, description: 'Maquiagem moderna', locked: !user.isPremium },
    { id: 'gender', name: 'Troca de Gênero', icon: User, description: 'Masculino ↔ Feminino', locked: !user.isPremium },
    { id: 'age', name: 'Filtros de Idade', icon: Wand2, description: 'Jovem, idoso, bebê', locked: !user.isPremium },
    { id: 'weight', name: 'Filtros de Peso', icon: User, description: 'Mais magro/pesado', locked: !user.isPremium },
    { id: 'style-copy', name: 'Copiar Estilo', icon: ImageIcon, description: 'De outra foto', locked: !user.isPremium },
    { id: 'mosaic', name: 'Mosaico', icon: Palette, description: 'Censurar áreas', locked: !user.isPremium },
    { id: 'magic-brush', name: 'Pincel Mágico', icon: Wand2, description: 'Rabiscos artísticos', locked: !user.isPremium },
    { id: 'ai-remove', name: 'Remoção IA', icon: Sparkles, description: 'Remove objetos', locked: !user.isPremium }
  ];

  const categories = [
    { id: 'free', name: 'Gratuito', icon: Sparkles },
    { id: 'premium', name: 'Premium', icon: Crown }
  ];

  const currentTools = selectedCategory === 'free' ? freeTools : premiumTools;

  const handleToolClick = (toolId: string, isLocked: boolean = false) => {
    if (isLocked) return;
    setActiveTool(toolId);
  };

  const handleSaveEdit = (editedImageUrl: string) => {
    setCurrentPhotoUrl(editedImageUrl);
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Aura BeautyIA</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user.isPremium && (
                <div className="hidden md:flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold">
                  <Crown className="w-5 h-5" />
                  Premium
                </div>
              )}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-16 bg-white rounded-l-3xl shadow-2xl p-6 w-64" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <User className="w-10 h-10 text-purple-500" />
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email || user.phone}</p>
                </div>
              </div>
              
              {user.isPremium && (
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="font-bold text-gray-800">Plano Premium</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.subscriptionType === 'annual' ? 'Anual' : 'Mensal'}
                  </p>
                </div>
              )}
              
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Biblioteca</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Configurações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Photo Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden mb-4">
                <img
                  src={currentPhotoUrl}
                  alt="Editing"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                  Salvar Edição
                </button>
                <button 
                  onClick={() => setCurrentPhotoUrl(photoUrl)}
                  className="px-6 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Resetar
                </button>
              </div>
            </div>
          </div>

          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ferramentas</h2>
              
              {/* Category Tabs */}
              <div className="flex gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Tools List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {currentTools.map((tool) => (
                  <button
                    key={tool.id}
                    disabled={tool.locked}
                    onClick={() => handleToolClick(tool.id, tool.locked)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      tool.locked
                        ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <tool.icon className={`w-6 h-6 flex-shrink-0 mt-1 ${
                          tool.locked ? 'text-gray-400' : 'text-purple-500'
                        }`} />
                        <div>
                          <h3 className={`font-bold mb-1 ${
                            tool.locked ? 'text-gray-500' : 'text-gray-800'
                          }`}>
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                      {tool.locked && (
                        <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Upgrade CTA */}
              {!user.isPremium && selectedCategory === 'premium' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <Crown className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Desbloqueie Premium</h3>
                      <p className="text-sm text-gray-600">
                        Acesse todas as ferramentas de transformação
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                    Ver Planos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Acne Removal Tool Modal */}
      {activeTool === 'acne' && (
        <AcneRemovalTool
          photoUrl={currentPhotoUrl}
          onClose={() => setActiveTool(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
