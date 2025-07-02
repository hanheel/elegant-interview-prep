
import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ModeSelection } from '@/components/ModeSelection';
import { DocumentInput } from '@/components/DocumentInput';
import { PracticeSettings } from '@/components/PracticeSettings';
import { InterviewSettings } from '@/components/InterviewSettings';
import { PracticeSession } from '@/components/PracticeSession';
import { InterviewSession } from '@/components/InterviewSession';
import { InterviewComplete } from '@/components/InterviewComplete';

type DocumentData = {
  type: 'link' | 'text';
  content: string;
};

type PracticeSettingsData = {
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

type InterviewSettingsData = {
  duration: number;
  speakingStyle: 'friend' | 'interviewer';
  mode: 'voice' | 'chat';
  maxSpeakingTime?: number;
};

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentMode, setCurrentMode] = useState<'practice' | 'interview' | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [practiceSettings, setPracticeSettings] = useState<PracticeSettingsData | null>(null);
  const [interviewSettings, setInterviewSettings] = useState<InterviewSettingsData | null>(null);
  const [interviewScore, setInterviewScore] = useState<number | null>(null);

  const handleModeSelect = (mode: 'practice' | 'interview') => {
    setCurrentMode(mode);
    setCurrentView('document-input');
  };

  const handleDocumentContinue = (data: DocumentData) => {
    setDocumentData(data);
    if (currentMode === 'practice') {
      setCurrentView('practice-settings');
    } else {
      setCurrentView('interview-settings');
    }
  };

  const handlePracticeStart = (settings: PracticeSettingsData) => {
    setPracticeSettings(settings);
    setCurrentView('practice');
    console.log('Practice started with:', { documentData, settings });
  };

  const handleInterviewStart = (settings: InterviewSettingsData) => {
    setInterviewSettings(settings);
    setCurrentView('interview');
    console.log('Interview started with:', { documentData, settings });
  };

  const handlePracticeComplete = () => {
    setCurrentView('home');
    // 연습 완료 후 초기화
    setCurrentMode(null);
    setDocumentData(null);
    setPracticeSettings(null);
  };

  const handleInterviewComplete = (score: number) => {
    setInterviewScore(score);
    setCurrentView('interview-complete');
  };

  const handleSaveToArchive = () => {
    // TODO: 아카이브에 저장 로직
    console.log('Saving to archive with score:', interviewScore);
    setCurrentView('archive');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    // 모든 상태 초기화
    setCurrentMode(null);
    setDocumentData(null);
    setPracticeSettings(null);
    setInterviewSettings(null);
    setInterviewScore(null);
  };

  const handleBack = () => {
    if (currentView === 'document-input') {
      setCurrentView('home');
      setCurrentMode(null);
    } else if (currentView === 'practice-settings' || currentView === 'interview-settings') {
      setCurrentView('document-input');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <ModeSelection onModeSelect={handleModeSelect} />;
      case 'document-input':
        return <DocumentInput onContinue={handleDocumentContinue} onBack={handleBack} />;
      case 'practice-settings':
        return <PracticeSettings onStart={handlePracticeStart} onBack={handleBack} />;
      case 'interview-settings':
        return <InterviewSettings onStart={handleInterviewStart} onBack={handleBack} />;
      case 'practice':
        return (
          <PracticeSession
            documentData={documentData!}
            settings={practiceSettings!}
            onComplete={handlePracticeComplete}
          />
        );
      case 'interview':
        return (
          <InterviewSession
            documentData={documentData!}
            settings={interviewSettings!}
            onComplete={handleInterviewComplete}
          />
        );
      case 'interview-complete':
        return (
          <InterviewComplete
            score={interviewScore!}
            onSaveToArchive={handleSaveToArchive}
            onHome={handleBackToHome}
          />
        );
      case 'documents':
      case 'archive':
        return (
          <div className="container max-w-4xl mx-auto py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {currentView === 'documents' && '문서 저장소'}
                {currentView === 'archive' && '아카이브'}
              </h2>
              <p className="text-muted-foreground">곧 구현될 예정입니다.</p>
            </div>
          </div>
        );
      default:
        return <ModeSelection onModeSelect={handleModeSelect} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="interview-app-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {(currentView === 'practice' || currentView === 'interview' || currentView === 'documents' || currentView === 'archive') ? (
            <aside className="w-64 p-4 border-r">
              <Navigation currentView={currentView} onViewChange={setCurrentView} />
            </aside>
          ) : null}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
