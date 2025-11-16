"use client";

import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import CameraCapture from './components/CameraCapture';
import AIAssessment from './components/AIAssessment';
import SubscriptionScreen from './components/SubscriptionScreen';
import EditorScreen from './components/EditorScreen';
import { User, FacialAssessment, AppScreen } from '@/lib/types';

export default function AuraBeautyIA() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [assessment, setAssessment] = useState<FacialAssessment | null>(null);

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auraUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Se usuário já tem premium, pular para editor
      if (parsedUser.isPremium) {
        const savedPhoto = localStorage.getItem('userPhoto');
        if (savedPhoto) {
          setCapturedPhoto(savedPhoto);
          setCurrentScreen('editor');
        } else {
          setCurrentScreen('camera');
        }
      } else {
        // Se não tem premium, continuar fluxo normal
        setCurrentScreen('camera');
      }
    }
  }, []);

  const handleSplashComplete = () => {
    setCurrentScreen('auth');
  };

  const handleAuthComplete = (newUser: User) => {
    setUser(newUser);
    setCurrentScreen('camera');
  };

  const handlePhotoCapture = (photoUrl: string) => {
    setCapturedPhoto(photoUrl);
    localStorage.setItem('userPhoto', photoUrl);
    setCurrentScreen('assessment');
  };

  const handleAssessmentComplete = (newAssessment: FacialAssessment) => {
    setAssessment(newAssessment);
    setCurrentScreen('subscription');
  };

  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    if (user) {
      const updatedUser: User = {
        ...user,
        isPremium: true,
        subscriptionType: plan,
        subscriptionDate: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('auraUser', JSON.stringify(updatedUser));
    }
    setCurrentScreen('editor');
  };

  // Render current screen
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    
    case 'auth':
      return <AuthScreen onAuthComplete={handleAuthComplete} />;
    
    case 'camera':
      return <CameraCapture onPhotoCapture={handlePhotoCapture} />;
    
    case 'assessment':
      return <AIAssessment photoUrl={capturedPhoto} onComplete={handleAssessmentComplete} />;
    
    case 'subscription':
      return user ? (
        <SubscriptionScreen user={user} onSubscribe={handleSubscribe} />
      ) : null;
    
    case 'editor':
      return user && capturedPhoto ? (
        <EditorScreen user={user} photoUrl={capturedPhoto} />
      ) : null;
    
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
}
