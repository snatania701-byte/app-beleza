"use client";

import { useState } from 'react';
import { Check, Crown, Sparkles, Zap, CreditCard, QrCode, ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { User } from '@/lib/types';

interface SubscriptionScreenProps {
  user: User;
  onSubscribe: (plan: 'monthly' | 'annual') => void;
}

export default function SubscriptionScreen({ user, onSubscribe }: SubscriptionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null);
  const [pixKey, setPixKey] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const planPrices = {
    monthly: 29.90,
    annual: 179.90
  };

  const generatePixKey = () => {
    // Gera uma chave PIX aleatória simulada
    const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `00020126580014br.gov.bcb.pix0136${randomKey}520400005303986540${planPrices[selectedPlan].toFixed(2)}5802BR5925AURA BEAUTY IA6009SAO PAULO62070503***6304`;
  };

  const handleSelectPaymentMethod = (method: 'pix' | 'card') => {
    setPaymentMethod(method);
    if (method === 'pix') {
      setPixKey(generatePixKey());
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'number') {
      // Formata número do cartão: 0000 0000 0000 0000
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiry') {
      // Formata validade: MM/AA
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      // Apenas números, máx 4 dígitos
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setCardData({ ...cardData, [field]: formattedValue });
  };

  const handleCardPayment = () => {
    // Validação básica
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      alert('Por favor, preencha todos os dados do cartão');
      return;
    }

    setProcessing(true);

    // Simula processamento de pagamento
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);

      // Aguarda 2 segundos e finaliza
      setTimeout(() => {
        handleSubscribe();
      }, 2000);
    }, 3000);
  };

  const handlePixPayment = () => {
    setProcessing(true);

    // Simula confirmação de pagamento PIX
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);

      // Aguarda 2 segundos e finaliza
      setTimeout(() => {
        handleSubscribe();
      }, 2000);
    }, 3000);
  };

  const handleSubscribe = () => {
    // Atualizar usuário com plano premium
    const updatedUser: User = {
      ...user,
      isPremium: true,
      subscriptionType: selectedPlan,
      subscriptionDate: new Date().toISOString()
    };
    
    localStorage.setItem('auraUser', JSON.stringify(updatedUser));
    onSubscribe(selectedPlan);
  };

  const features = [
    'Maquiagem IA com filtros modernos',
    'Mudança de cor e estilo de cabelo',
    'Adicionar barba e bigode',
    'Troca de gênero',
    'Filtros de envelhecimento',
    'Filtros de peso',
    'Copiar estilo de fotos',
    'Pincel mágico e efeitos criativos',
    'Remoção de objetos com IA',
    'Mosaico e censura rápida',
    'Modo offline',
    'Sem anúncios',
    'Suporte prioritário',
    'Atualizações exclusivas'
  ];

  // Tela de Pagamento
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-8">
          {/* Header */}
          <button
            onClick={() => {
              setShowPayment(false);
              setPaymentMethod(null);
              setPaymentSuccess(false);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Success Message */}
            {paymentSuccess && (
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Pagamento Aprovado!
                </h2>
                <p className="text-gray-600">
                  Bem-vindo ao Aura Beauty Premium ✨
                </p>
              </div>
            )}

            {/* Payment Method Selection */}
            {!paymentMethod && !paymentSuccess && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                  Escolha a forma de pagamento
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  {selectedPlan === 'monthly' ? 'Plano Mensal' : 'Plano Anual'} - R$ {planPrices[selectedPlan].toFixed(2)}
                </p>

                <div className="grid gap-4">
                  {/* PIX Option */}
                  <button
                    onClick={() => handleSelectPaymentMethod('pix')}
                    className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-4 rounded-xl">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-bold text-gray-800">PIX</h3>
                      <p className="text-gray-600">Pagamento instantâneo</p>
                    </div>
                  </button>

                  {/* Card Option */}
                  <button
                    onClick={() => handleSelectPaymentMethod('card')}
                    className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-bold text-gray-800">Cartão de Crédito</h3>
                      <p className="text-gray-600">Débito ou crédito</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* PIX Payment */}
            {paymentMethod === 'pix' && !paymentSuccess && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Pagamento via PIX
                </h2>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white p-4 rounded-xl">
                      <QrCode className="w-32 h-32 text-gray-800" />
                    </div>
                  </div>

                  <p className="text-center text-gray-700 font-semibold mb-4">
                    Escaneie o QR Code ou copie a chave PIX
                  </p>

                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-600 break-all font-mono">
                      {pixKey}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyPix}
                    className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    {pixCopied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copiar Chave PIX
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-800 text-center">
                    ⏱️ Após realizar o pagamento, clique em "Confirmar Pagamento"
                  </p>
                </div>

                <button
                  onClick={handlePixPayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Verificando pagamento...' : 'Confirmar Pagamento'}
                </button>
              </>
            )}

            {/* Card Payment */}
            {paymentMethod === 'card' && !paymentSuccess && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Dados do Cartão
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => handleCardInputChange('number', e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => handleCardInputChange('name', e.target.value.toUpperCase())}
                      placeholder="NOME COMPLETO"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Total a pagar:</span>
                    <span className="text-2xl font-bold text-purple-600">
                      R$ {planPrices[selectedPlan].toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCardPayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Confirmar Pagamento
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Pagamento 100% seguro e criptografado
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tela de Seleção de Planos
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Escolha seu Plano Premium
          </h1>
          <p className="text-xl text-gray-600">
            Desbloqueie todo o poder da IA para transformar sua beleza
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`bg-white rounded-3xl shadow-xl p-8 cursor-pointer transition-all hover:scale-105 ${
              selectedPlan === 'monthly'
                ? 'ring-4 ring-purple-500 shadow-2xl'
                : 'hover:shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Plano Mensal</h2>
                <p className="text-gray-600">Flexibilidade total</p>
              </div>
              <Zap className="w-12 h-12 text-purple-500" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-800">R$ 29,90</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Renovação automática mensal</p>
            </div>

            <div className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {selectedPlan === 'monthly' ? 'Plano Selecionado' : 'Selecionar Plano'}
            </div>
          </div>

          {/* Annual Plan */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`bg-white rounded-3xl shadow-xl p-8 cursor-pointer transition-all hover:scale-105 relative ${
              selectedPlan === 'annual'
                ? 'ring-4 ring-purple-500 shadow-2xl'
                : 'hover:shadow-2xl'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                MELHOR OFERTA
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Plano Anual</h2>
                <p className="text-gray-600">Economize 40%</p>
              </div>
              <Crown className="w-12 h-12 text-yellow-500" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-800">R$ 179,90</span>
                <span className="text-gray-600">/ano</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500 line-through">R$ 358,80</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  Economize R$ 178,90
                </span>
              </div>
              <p className="text-sm text-purple-600 font-semibold mt-2">
                Apenas R$ 14,99/mês
              </p>
            </div>

            <div className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedPlan === 'annual'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {selectedPlan === 'annual' ? 'Plano Selecionado' : 'Selecionar Plano'}
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Tudo que você terá acesso:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="text-center">
          <button
            onClick={() => setShowPayment(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            <Crown className="w-7 h-7" />
            Continuar para Pagamento
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Cancele a qualquer momento • Garantia de 7 dias
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm">Pagamento Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm">Sem Taxas Ocultas</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm">Suporte 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
