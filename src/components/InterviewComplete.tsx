
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Home, Archive, FileText, Loader2, Sparkles } from 'lucide-react';

interface InterviewCompleteProps {
  score: number;
  onSaveToArchive: (document?: string) => void;
  onHome: () => void;
}

const mockDocuments = [
  `# 면접 결과 분석 보고서

## 면접 개요
- **면접 일시**: ${new Date().toLocaleDateString('ko-KR')}
- **면접 형태**: 실전 면접 모드
- **최종 점수**: 85점

## 주요 강점
1. **기술적 이해도가 뛰어남**
   - React의 Virtual DOM과 상태 관리에 대한 깊은 이해를 보여줌
   - 성능 최적화 관련 질문에 구체적인 예시와 함께 답변

2. **실무 경험이 풍부함**
   - 실제 프로젝트에서 겪은 문제와 해결 과정을 구체적으로 설명
   - 팀워크와 협업 경험이 잘 드러남

3. **문제 해결 능력**
   - 복잡한 기술적 문제에 대해 체계적으로 접근
   - 여러 대안을 고려하여 최적의 솔루션 제시

## 개선이 필요한 영역
1. **새로운 기술 트렌드에 대한 이해**
   - 최신 프레임워크나 라이브러리에 대한 학습이 필요
   - 업계 동향을 지속적으로 파악할 것을 권장

2. **커뮤니케이션 스킬**
   - 기술적 내용을 비개발자에게 설명하는 능력 향상 필요
   - 더 간결하고 명확한 답변 연습 권장

## 추천 학습 방향
- Next.js, TypeScript 심화 학습
- 시스템 설계 및 아키텍처 공부
- 알고리즘 및 자료구조 복습
- 커뮤니케이션 스킬 향상을 위한 프레젠테이션 연습

## 종합 평가
전반적으로 우수한 기술적 역량을 보유하고 있으며, 실무 경험도 풍부합니다. 몇 가지 영역에서 보완이 이루어진다면 더욱 경쟁력 있는 개발자가 될 것으로 판단됩니다.`,

  `# 기술 면접 심화 분석

## 핵심 역량 평가

### 1. 프론트엔드 개발 (9/10)
React 생태계에 대한 이해도가 매우 높으며, 현대적인 개발 패턴을 잘 활용하고 있습니다.

**강점:**
- Hook 패턴의 효과적 활용
- 컴포넌트 설계 원칙 이해
- 상태 관리 라이브러리 경험

**보완점:**
- 성능 측정 도구 활용법 학습 필요

### 2. 백엔드 지식 (7/10)
기본적인 서버 사이드 개념은 잘 이해하고 있으나, 심화 내용에서 아쉬움이 있었습니다.

**강점:**
- RESTful API 설계 이해
- 데이터베이스 기본 개념 숙지

**보완점:**
- 마이크로서비스 아키텍처 학습
- 캐싱 전략 심화 학습

### 3. 문제 해결 능력 (8/10)
체계적인 접근 방식을 보여주었으며, 논리적 사고력이 우수합니다.

## 면접관 총평
기술적 기반이 탄탄하며, 지속적인 학습 의지가 엿보입니다. 추가 학습을 통해 시니어 레벨로 성장할 가능성이 높습니다.`
];

export function InterviewComplete({ score, onSaveToArchive, onHome }: InterviewCompleteProps) {
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
      const randomDocument = mockDocuments[Math.floor(Math.random() * mockDocuments.length)];
      setGeneratedDocument(randomDocument);
      setIsGeneratingDocument(false);
      onSaveToArchive(randomDocument);
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
            <h2 className="text-2xl font-bold mb-4">AI가 문서화 중입니다</h2>
            <p className="text-muted-foreground mb-4">
              면접 내용을 분석하여 상세한 보고서를 생성하고 있습니다...
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
              AI 문서화 후 아카이브 저장
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              면접 결과를 AI가 분석하여 상세한 보고서로 문서화한 후 아카이브에 저장합니다.
              이 과정은 몇 초 정도 소요됩니다.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                생성될 문서 내용:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 면접 결과 종합 분석</li>
                <li>• 주요 강점 및 개선점</li>
                <li>• 추천 학습 방향</li>
                <li>• 상세 피드백 및 조언</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                취소
              </Button>
              <Button onClick={handleConfirmSave} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                문서화 시작
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
