import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, ArrowRight, Sparkles, Loader2, FileText } from 'lucide-react';

interface PracticeSessionProps {
  documentData: { type: 'link' | 'text'; content: string };
  settings: { questionCount: number; difficulty: 'easy' | 'medium' | 'hard' };
  onComplete: (practiceData: any) => void;
}

// 모의 질문 데이터
const mockQuestions = {
  easy: [
    "HTML과 CSS의 차이점을 설명해주세요.",
    "JavaScript의 변수 선언 방법들을 비교해주세요.",
    "함수형 프로그래밍의 기본 개념을 설명해주세요.",
    "REST API란 무엇인지 설명해주세요.",
    "Git의 기본 명령어들을 설명해주세요."
  ],
  medium: [
    "React의 Virtual DOM이 무엇이고 왜 사용하는지 설명해주세요.",
    "Promise와 async/await의 차이점을 설명해주세요.",
    "데이터베이스 정규화에 대해 설명해주세요.",
    "웹 성능 최적화 방법들을 설명해주세요.",
    "MVC 패턴에 대해 설명해주세요."
  ],
  hard: [
    "마이크로서비스 아키텍처의 장단점을 설명해주세요.",
    "데이터베이스 트랜잭션의 ACID 속성을 설명해주세요.",
    "Load Balancing 전략들을 비교해주세요.",
    "캐싱 전략과 구현 방법을 설명해주세요.",
    "대용량 데이터 처리를 위한 설계 방법을 설명해주세요."
  ]
};

const mockFollowUpQuestions = [
  "실제 프로젝트에서 어떻게 적용해보셨나요?",
  "이 방법의 단점은 무엇이라고 생각하시나요?",
  "다른 대안과 비교했을 때 어떤 장점이 있을까요?",
  "실제 구현 시 어려웠던 점은 무엇인가요?",
  "성능상 고려해야 할 점이 있다면 무엇인가요?"
];

const mockPracticeDocuments = [
  `# 연습 세션 분석 리포트

## 연습 개요
- **연습 일시**: ${new Date().toLocaleDateString('ko-KR')}
- **연습 유형**: 기술 면접 연습
- **문제 수**: 5문제
- **평균 점수**: 87점

## 문제별 분석

### 1. HTML과 CSS의 차이점
**답변 점수**: 90점
- 핵심 개념을 정확히 이해하고 있음
- 구체적인 예시를 들어 설명한 점이 좋음
- **개선점**: 실무 활용 경험 추가 설명 권장

### 2. JavaScript 변수 선언 방법
**답변 점수**: 85점  
- var, let, const의 차이점을 명확히 설명
- 호이스팅 개념도 잘 이해하고 있음
- **개선점**: 실제 프로젝트 적용 사례 언급하면 더 좋음

### 3. 함수형 프로그래밍
**답변 점수**: 88점
- 불변성과 순수 함수 개념을 정확히 설명
- 장단점을 균형 있게 제시
- **개선점**: 구체적인 라이브러리 예시 추가

## 전체적인 강점
1. **기초 개념 탄탄함**: 기본기가 잘 갖춰져 있음
2. **논리적 사고**: 체계적으로 답변을 구성함  
3. **학습 의지**: 추가 질문에도 적극적으로 대답

## 개선 방향
1. **실무 경험 연결**: 이론과 실무를 더 연결하여 설명
2. **최신 트렌드 학습**: 새로운 기술 동향 파악 필요
3. **심화 학습**: 기본기를 바탕으로 고급 주제 학습

## 다음 연습 추천
- 중급 난이도 문제로 도전
- 시스템 설계 관련 문제 연습
- 알고리즘 문제 해결 능력 향상

## 종합 평가
기초가 탄탄하고 학습 태도가 좋습니다. 꾸준한 연습을 통해 더욱 발전할 수 있을 것으로 기대됩니다.`,

  `# 기술 연습 세션 상세 분석

## 연습 성과 요약
이번 연습에서는 전반적으로 우수한 성과를 보여주었습니다.

### 핵심 역량 평가
- **기술적 이해도**: 9/10
- **설명 능력**: 8/10  
- **논리적 사고**: 9/10
- **실무 연결성**: 7/10

### 인상 깊었던 답변들
1. **REST API 설명**: 실제 프로젝트 경험과 연결하여 구체적으로 설명
2. **Git 명령어**: 각 명령어의 사용 시나리오를 명확히 제시
3. **함수형 프로그래밍**: 복잡한 개념을 쉽게 풀어서 설명

### 성장 포인트
- 최신 기술 트렌드에 대한 관심 증대 필요
- 실무 프로젝트 경험을 더 적극적으로 활용
- 꼬리 질문에 대한 대응 능력 향상

### 추천 학습 계획
다음 단계로 중급 수준의 문제들에 도전해보시기 바랍니다. 특히 시스템 설계와 성능 최적화 분야의 학습을 권장합니다.

## 마무리
꾸준한 연습과 학습을 통해 더욱 성장할 수 있을 것입니다. 화이팅!`
];

const generatePracticeLearningDocument = (questionIndex: number, settings: any) => {
  return `# 연습 학습 기록

## 학습 개요
- **학습 일시**: ${new Date().toLocaleDateString('ko-KR')}
- **연습 유형**: 기술 면접 연습 (${settings.difficulty === 'easy' ? '기초' : settings.difficulty === 'medium' ? '중급' : '고급'} 수준)
- **완료한 문제**: ${questionIndex + 1}/${settings.questionCount}개
- **평균 점수**: ${85 + Math.floor(Math.random() * 15)}점

## 학습 내용 정리

### 문제 1: HTML과 CSS의 차이점
**질문**: "HTML과 CSS의 차이점을 설명해주세요."

**학습자 답변**: "HTML은 웹페이지의 구조와 내용을 정의하는 마크업 언어이고, CSS는 HTML 요소들의 스타일과 레이아웃을 담당합니다..."

**핵심 학습 포인트**:
- HTML의 시맨틱 구조에 대한 이해
- CSS의 스타일링 역할과 중요성
- 두 언어의 협력적 관계

**꼬리 질문**: "실제 프로젝트에서 어떻게 적용해보셨나요?"

**답변**: "최근 프로젝트에서 시맨틱 HTML을 사용하여 접근성을 개선하고, CSS Grid와 Flexbox를 활용하여 반응형 레이아웃을 구현했습니다..."

### 문제 2: JavaScript 변수 선언 방법
**질문**: "JavaScript의 변수 선언 방법들을 비교해주세요."

**학습자 답변**: "var, let, const 세 가지 방법이 있으며, var는 함수 스코프, let과 const는 블록 스코프를 가집니다..."

**핵심 학습 포인트**:
- 스코프의 차이점과 호이스팅
- const의 불변성과 활용 방법
- 모던 JavaScript에서의 권장 사용법

## 학습 성과 분석

### 이번 연습에서 잘한 점
1. **기본 개념 이해**: 핵심 개념들을 정확히 파악하고 설명
2. **실무 연결**: 이론적 지식을 실제 프로젝트 경험과 연결
3. **논리적 구성**: 답변을 체계적으로 구성하여 전달

### 더 발전시킬 영역
1. **심화 학습**: 기본기를 바탕으로 고급 주제 학습 필요
2. **최신 트렌드**: 새로운 기술과 패러다임에 대한 지속적 학습
3. **실무 사례**: 더 다양한 프로젝트 경험 축적

## 다음 학습 계획
- ${settings.difficulty === 'easy' ? '중급' : settings.difficulty === 'medium' ? '고급' : '실무'} 수준 문제 도전
- 시스템 설계 및 아키텍처 학습
- 알고리즘과 자료구조 복습

## 학습 후기
기초가 탄탄하게 다져져 있어 더 높은 수준으로 발전할 준비가 되었습니다. 꾸준한 연습을 통해 목표를 달성해 나가시기 바랍니다!`;
};

export function PracticeSession({ documentData, settings, onComplete }: PracticeSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showFollowUpFeedback, setShowFollowUpFeedback] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  
  // 질문과 꼬리질문을 고정하기 위한 ref 사용
  const questionsRef = useRef(mockQuestions[settings.difficulty]);
  const followUpQuestionRef = useRef(mockFollowUpQuestions[Math.floor(Math.random() * mockFollowUpQuestions.length)]);

  const currentQuestion = questionsRef.current[currentQuestionIndex];
  const followUpQuestion = followUpQuestionRef.current;
  const isLastQuestion = currentQuestionIndex === settings.questionCount - 1;

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    setShowFeedback(true);
  };

  const handleNextToFollowUp = () => {
    // 메인 답변 점수 생성
    const score = Math.floor(Math.random() * 21) + 80;
    setScores(prev => [...prev, score]);
    
    setShowFeedback(false);
    setShowFollowUp(true);
  };

  const handleSubmitFollowUp = () => {
    if (!followUpAnswer.trim()) return;
    setShowFollowUpFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // 마지막 꼬리질문 점수 추가
      const finalScore = Math.floor(Math.random() * 21) + 80;
      const finalScores = [...scores, finalScore];
      setScores(finalScores);
      
      setShowSaveModal(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
      setFollowUpAnswer('');
      setShowFeedback(false);
      setShowFollowUp(false);
      setShowFollowUpFeedback(false);
      // 새로운 꼬리질문 생성
      followUpQuestionRef.current = mockFollowUpQuestions[Math.floor(Math.random() * mockFollowUpQuestions.length)];
    }
  };

  const handleSavePractice = () => {
    setShowSaveModal(false);
    setIsGeneratingDocument(true);
    
    // 3초 후 문서 생성 완료
    setTimeout(() => {
      const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const learningDocument = generatePracticeLearningDocument(currentQuestionIndex, settings);
      
      const practiceData = {
        score: averageScore,
        questionsAnswered: currentQuestionIndex + 1,
        averageScore,
        totalTime: 0,
        document: learningDocument
      };
      
      setIsGeneratingDocument(false);
      onComplete(practiceData);
    }, 3000);
  };

  const handleSkipSave = () => {
    onComplete(null); // null을 전달하여 저장하지 않음을 표시
  };

  const getFeedback = () => {
    return {
      positive: [
        "구체적인 예시를 들어 설명해주셔서 이해하기 쉬웠습니다.",
        "핵심 개념을 정확히 파악하고 계시네요.",
        "실무 경험이 잘 드러나는 답변이었습니다."
      ],
      improvement: [
        "좀 더 구체적인 예시를 들어 설명하시면 더 좋을 것 같습니다.",
        "기술적인 세부사항을 조금 더 추가하시면 완벽할 것 같습니다.",
        "실제 프로젝트 경험과 연결해서 설명하시면 더 설득력이 있을 것 같습니다."
      ]
    };
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
              연습 내용을 분석하여 학습 문서를 생성하고 있습니다...
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

  const progress = ((currentQuestionIndex + (showFollowUpFeedback ? 1 : 0)) / settings.questionCount) * 100;

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* 고정된 프로그래스 바 */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto py-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">연습 모드</h2>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {settings.questionCount}
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* 컨텐츠 영역 (프로그래스 바 높이만큼 여백 추가) */}
      <div className="mt-24">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              질문 {currentQuestionIndex + 1}
              <Badge variant={settings.difficulty === 'easy' ? 'secondary' : 
                            settings.difficulty === 'medium' ? 'default' : 'destructive'}>
                {settings.difficulty === 'easy' ? '쉬움' : 
                 settings.difficulty === 'medium' ? '보통' : '고급'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg">{currentQuestion}</p>
            </div>

            {!showFollowUp && (
              <div className="space-y-4">
                <Textarea
                  placeholder="답변을 입력해주세요..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[200px]"
                  disabled={showFeedback}
                />
                
                {!showFeedback && (
                  <Button onClick={handleSubmitAnswer} disabled={!answer.trim()}>
                    답변 제출
                  </Button>
                )}
              </div>
            )}

            {showFeedback && !showFollowUp && (
              <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  피드백
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">좋은 점</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-600 dark:text-green-400">
                      {getFeedback().positive.slice(0, 2).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">보완할 점</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-600 dark:text-green-400">
                      {getFeedback().improvement.slice(0, 1).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button onClick={handleNextToFollowUp} className="w-full">
                  꼬리 질문으로 이동 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {showFollowUp && (
              <div className="space-y-4 border-l-4 border-orange-400 pl-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">꼬리 질문</h3>
                </div>
                <p className="text-orange-700 dark:text-orange-300 font-medium">{followUpQuestion}</p>
                
                <Textarea
                  placeholder="꼬리 질문에 대한 답변을 입력해주세요..."
                  value={followUpAnswer}
                  onChange={(e) => setFollowUpAnswer(e.target.value)}
                  className="min-h-[150px]"
                  disabled={showFollowUpFeedback}
                />
                
                {!showFollowUpFeedback && (
                  <Button onClick={handleSubmitFollowUp} disabled={!followUpAnswer.trim()}>
                    꼬리 질문 답변 제출
                  </Button>
                )}
              </div>
            )}

            {showFollowUpFeedback && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  꼬리 질문 피드백
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">좋은 점</h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                      <li>추가 질문에 대해서도 논리적으로 잘 답변해주셨습니다.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">보완할 점</h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                      <li>실제 경험과 더 연결해서 설명하시면 더 좋을 것 같습니다.</li>
                    </ul>
                  </div>
                </div>
                <Button onClick={handleNextQuestion} className="w-full">
                  {isLastQuestion ? '연습 완료' : '다음 질문으로'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 저장 확인 모달 */}
      <Dialog open={showSaveModal} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              연습 완료! AI 학습 문서화 후 저장하시겠습니까?
            </DialogTitle>
            <DialogDescription>
              연습 내용을 AI가 분석하여 학습 문서로 정리한 후 아카이브에 저장합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                생성될 학습 문서 내용:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 연습 질문과 답변 내용 정리</li>
                <li>• 핵심 학습 포인트 추출</li>
                <li>• 잘한 점과 발전 영역 분석</li>
                <li>• 개인화된 다음 학습 계획</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleSkipSave}>
                저장하지 않기
              </Button>
              <Button onClick={handleSavePractice} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                학습 문서화 후 저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
