
import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { ModeSelection } from '@/components/ModeSelection';
import { DocumentInput } from '@/components/DocumentInput';
import { PracticeSettings } from '@/components/PracticeSettings';
import { InterviewSettings } from '@/components/InterviewSettings';
import { PracticeSession } from '@/components/PracticeSession';
import { InterviewSession } from '@/components/InterviewSession';
import { InterviewComplete } from '@/components/InterviewComplete';
import { ArchivePage } from '@/components/ArchivePage';
import { DocumentsPage } from '@/components/DocumentsPage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

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
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingView, setPendingView] = useState<string | null>(null);

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
    // 아카이브에 저장
    const archiveData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: interviewScore!,
      documentData: documentData!,
      settings: interviewSettings!
    };
    
    const existingArchive = JSON.parse(localStorage.getItem('interview-archive') || '[]');
    existingArchive.push(archiveData);
    localStorage.setItem('interview-archive', JSON.stringify(existingArchive));
    
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

  const handleNavigationChange = (view: string) => {
    // 면접이나 연습 중일 때 경고 표시
    if (currentView === 'practice' || currentView === 'interview') {
      setPendingView(view);
      setShowExitModal(true);
    } else {
      setCurrentView(view);
      // 상태 초기화
      if (view === 'home') {
        setCurrentMode(null);
        setDocumentData(null);
        setPracticeSettings(null);
        setInterviewSettings(null);
        setInterviewScore(null);
      }
    }
  };

  const confirmExit = () => {
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
      // 상태 초기화
      setCurrentMode(null);
      setDocumentData(null);
      setPracticeSettings(null);
      setInterviewSettings(null);
      setInterviewScore(null);
    }
    setShowExitModal(false);
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
        return <DocumentsPage />;
      case 'archive':
        return <ArchivePage />;
      default:
        return <ModeSelection onModeSelect={handleModeSelect} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="interview-app-theme">
      <div className="min-h-screen bg-background">
        <Header currentView={currentView} onViewChange={handleNavigationChange} />
        <main className="flex-1">
          {renderContent()}
        </main>
        
        {/* 종료 확인 모달 */}
        <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                진행 중인 세션이 있습니다
              </DialogTitle>
              <DialogDescription>
                현재 진행 중인 면접/연습이 종료됩니다. 진행 상황은 저장되지 않습니다. 
                정말로 나가시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowExitModal(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={confirmExit}>
                나가기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Index;
