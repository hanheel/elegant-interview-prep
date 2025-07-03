
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

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

export function PracticeSession({ documentData, settings, onComplete }: PracticeSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showFollowUpFeedback, setShowFollowUpFeedback] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
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
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const practiceData = {
      score: averageScore,
      questionsAnswered: currentQuestionIndex + 1,
      averageScore,
      totalTime: 0 // 연습 모드는 시간 제한이 없음
    };
    onComplete(practiceData);
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
            <DialogTitle>연습 완료!</DialogTitle>
            <DialogDescription>
              연습 결과를 아카이브에 저장하시겠습니까? 
              저장하시면 나중에 연습 기록을 다시 확인하실 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleSkipSave}>
              저장하지 않기
            </Button>
            <Button onClick={handleSavePractice}>
              아카이브에 저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
