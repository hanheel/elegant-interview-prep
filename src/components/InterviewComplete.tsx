
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Home, Archive, FileText, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  score?: number;
}

interface InterviewCompleteProps {
  score: number;
  chatHistory: Message[];
  onSaveToArchive: (document?: string) => void;
  onHome: () => void;
}

const generateLearningDocument = (messages: Message[]) => {
  const userResponses = messages.filter(msg => msg.type === 'user');
  const aiQuestions = messages.filter(msg => msg.type === 'ai' && !msg.score);
  
  return `# 면접 학습 기록

## 학습 개요
- **학습 일시**: ${new Date().toLocaleDateString('ko-KR')}
- **총 질문 수**: ${aiQuestions.length}개
- **답변 수**: ${userResponses.length}개
- **최종 점수**: ${85 + Math.floor(Math.random() * 15)}점

## 주요 학습 내용

### 질문 1: 기술적 이해도 평가
**면접관 질문**: "${aiQuestions[0]?.content.substring(0, 100)}..."

**학습자 답변**: "${userResponses[0]?.content.substring(0, 200)}..."

**핵심 학습 포인트**:
- React의 Virtual DOM 개념에 대한 이해
- 실제 프로젝트 경험과 이론의 연결
- 성능 최적화에 대한 인사이트

### 질문 2: 문제 해결 능력 평가  
**면접관 질문**: "${aiQuestions[1]?.content.substring(0, 100)}..."

**학습자 답변**: "${userResponses[1]?.content.substring(0, 200)}..."

**핵심 학습 포인트**:
- 체계적인 문제 접근 방식
- 디버깅 프로세스에 대한 이해
- 팀워크와 협업 경험

## 학습 성과 분석

### 강점
1. **기술적 기반**: 핵심 개념에 대한 탄탄한 이해
2. **실무 연결**: 이론과 실제 경험의 효과적 연결  
3. **논리적 사고**: 체계적이고 구조화된 답변

### 성장 영역
1. **최신 기술 트렌드**: 새로운 기술에 대한 지속적 학습 필요
2. **구체적 사례**: 더 다양한 실무 경험 사례 준비
3. **커뮤니케이션**: 복잡한 내용을 간결하게 전달하는 능력

## 학습 권장사항
- Next.js, TypeScript 등 최신 기술 스택 심화 학습
- 실제 프로젝트를 통한 경험 확장
- 기술 블로그나 발표를 통한 지식 정리 및 공유
- 오픈소스 기여를 통한 실무 역량 강화

## 다음 학습 목표
이번 면접 학습을 바탕으로 다음 영역에 집중하여 발전시켜 나가시기 바랍니다.`;
};

export function InterviewComplete({ score, chatHistory, onSaveToArchive, onHome }: InterviewCompleteProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  const handleSaveToArchive = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    setShowSaveModal(false);
    setIsGeneratingDocument(true);
    
    // 3초 후 문서 생성 완료
    setTimeout(() => {
      const learningDocument = generateLearningDocument(chatHistory);
      setGeneratedDocument(learningDocument);
      setIsGeneratingDocument(false);
      onSaveToArchive(learningDocument);
    }, 3000);
  };

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreMessage = () => {
    if (score >= 90) return '훌륭한 면접이었습니다!';
    if (score >= 80) return '좋은 결과입니다!';
    if (score >= 70) return '괜찮은 면접이었습니다.';
    return '다음엔 더 좋은 결과가 있을 거예요.';
  };

  if (isGeneratingDocument) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card>
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                <Loader2 className="h-8 w-8 text-primary/60 animate-spin absolute top-2 left-2" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">AI가 학습 내용을 문서화 중입니다</h2>
            <p className="text-muted-foreground mb-4">
              면접 대화 내용을 분석하여 학습 문서를 생성하고 있습니다...
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <div className="h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
                <div className="h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${getScoreColor()}`}>
              <Trophy className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">면접 완료!</CardTitle>
          <p className="text-xl text-muted-foreground">{getScoreMessage()}</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <div className="text-6xl font-bold text-primary mb-2">{score}</div>
            <div className="text-muted-foreground">점수</div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={handleSaveToArchive} className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              아카이브에 저장
            </Button>
            <Button variant="outline" onClick={onHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              홈으로 가기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 저장 확인 모달 */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI 학습 문서화 후 아카이브 저장
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              면접 대화 내용을 AI가 분석하여 학습 문서로 정리한 후 아카이브에 저장합니다.
              이 과정은 몇 초 정도 소요됩니다.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                생성될 학습 문서 내용:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 면접 질문과 답변 내용 정리</li>
                <li>• 핵심 학습 포인트 추출</li>
                <li>• 강점과 성장 영역 분석</li>
                <li>• 개인화된 학습 권장사항</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                취소
              </Button>
              <Button onClick={handleConfirmSave} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                학습 문서화 시작
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
