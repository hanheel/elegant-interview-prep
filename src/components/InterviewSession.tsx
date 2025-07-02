
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Clock, Mic, MicOff, Send, User, Bot, Loader2 } from 'lucide-react';

interface InterviewSessionProps {
  documentData: { type: 'link' | 'text'; content: string };
  settings: {
    duration: number;
    speakingStyle: 'friend' | 'interviewer';
    mode: 'voice' | 'chat';
    maxSpeakingTime?: number;
  };
  onComplete: (score: number, chatHistory: Message[]) => void;
}

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  score?: number;
}

const mockQuestions = {
  friend: [
    "안녕하세요! 개발 공부하면서 가장 재미있었던 프로젝트가 무엇인지 궁금해요. 어떤 기술을 사용하셨고, 왜 그 기술을 선택하게 되셨는지 구체적인 경험을 들려주실 수 있을까요?",
    "말씀해주신 기술 선택이 정말 흥미롭네요! FSD 아키텍처에 대해 이론적인 부분은 이해가 가는데, 구체적인 예시가 있으면 더 좋을 것 같아요. 경험을 담은 예시를 말씀해 주실 수 있나요?",
    "개발하면서 정말 어려웠던 버그나 문제 상황이 있으셨나요? 어떻게 해결하셨는지, 그 과정에서 배운 점이 있다면 구체적인 예시와 함께 말씀해주세요.",
    "팀 프로젝트를 진행하실 때 어떤 역할을 주로 맡으셨나요? 팀원들과 소통하면서 겪으셨던 구체적인 경험이나 해결 방법이 있다면 들려주세요.",
    "앞으로 어떤 개발자가 되고 싶으신지, 그리고 그 목표를 위해 현재 어떤 노력을 하고 계신지 구체적인 계획과 함께 말씀해주세요."
  ],
  interviewer: [
    "본인의 주요 프로젝트 경험에 대해 상세히 설명해주시기 바랍니다. 특히 기술적 난제와 해결 과정을 중심으로 구체적인 예시를 포함해서 말씀해주세요.",
    "사용하신 기술 스택을 선택한 구체적인 근거는 무엇인가요? 다른 대안과 비교했을 때의 장단점도 함께 설명해주시기 바랍니다.",
    "개발 중 발생한 가장 인상 깊은 기술적 문제와 해결 방법에 대해 말씀해주세요. 문제 해결 과정에서의 사고 과정도 포함해서 설명해주시기 바랍니다.",
    "팀워크에서 본인의 역할과 기여도를 구체적인 사례와 함께 설명해주시기 바랍니다. 협업 과정에서 발생한 갈등이나 문제를 어떻게 해결하셨는지도 말씀해주세요.",
    "향후 커리어 목표와 구체적인 성장 계획을 말씀해주시기 바랍니다. 현재 부족한 부분과 이를 개선하기 위한 실행 방안도 포함해서 설명해주세요."
  ]
};

export function InterviewSession({ documentData, settings, onComplete }: InterviewSessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(settings.duration * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTimeLeft, setVoiceTimeLeft] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const questions = mockQuestions[settings.speakingStyle];
  const totalDuration = settings.duration * 60;

  useEffect(() => {
    // 첫 질문 자동 전송
    setIsAiSpeaking(true);
    setTimeout(() => {
      const firstMessage: Message = {
        id: '1',
        type: 'ai',
        content: questions[0],
        timestamp: new Date()
      };
      setMessages([firstMessage]);
      setIsAiSpeaking(false);
      
      // 음성 모드면 자동으로 모달 표시
      if (settings.mode === 'voice' && settings.maxSpeakingTime) {
        setTimeout(() => {
          setVoiceTimeLeft(settings.maxSpeakingTime!);
          setShowVoiceModal(true);
          setIsRecording(true);
        }, 1000);
      }
    }, 2000);

    // 타이머 시작
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleInterviewEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showVoiceModal && voiceTimeLeft > 0) {
      const voiceTimer = setInterval(() => {
        setVoiceTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(voiceTimer);
            handleVoiceComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(voiceTimer);
    }
  }, [showVoiceModal, voiceTimeLeft]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAiSpeaking(true);

    // AI 피드백 및 다음 질문 생성
    setTimeout(() => {
      const score = Math.floor(Math.random() * 21) + 80; // 80-100점 랜덤
      setScores(prev => [...prev, score]);

      const feedback = generateFeedback(score, settings.speakingStyle);
      const feedbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: feedback,
        timestamp: new Date(),
        score
      };

      setMessages(prev => [...prev, feedbackMessage]);

      // 다음 질문
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          const nextQuestionIndex = currentQuestionIndex + 1;
          const nextQuestion: Message = {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: questions[nextQuestionIndex],
            timestamp: new Date()
          };
          setMessages(prev => [...prev, nextQuestion]);
          setCurrentQuestionIndex(nextQuestionIndex);
          setIsAiSpeaking(false);
          
          // 음성 모드면 자동으로 모달 표시
          if (settings.mode === 'voice' && settings.maxSpeakingTime) {
            setTimeout(() => {
              setVoiceTimeLeft(settings.maxSpeakingTime!);
              setShowVoiceModal(true);
              setIsRecording(true);
            }, 1000);
          }
        }, 1000);
      } else {
        setIsAiSpeaking(false);
      }
    }, 3000);
  };

  const handleVoiceComplete = () => {
    setIsRecording(false);
    setShowVoiceModal(false);
    // 음성을 텍스트로 변환 (모의)
    const mockTranscription = "음성으로 답변한 내용이 여기에 표시됩니다. 실제 구현에서는 음성 인식 API를 사용하여 변환됩니다.";
    setInputValue(mockTranscription);
    
    // 자동 전송
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: mockTranscription,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsAiSpeaking(true);

      // AI 피드백 처리
      setTimeout(() => {
        const score = Math.floor(Math.random() * 21) + 80;
        setScores(prev => [...prev, score]);

        const feedback = generateFeedback(score, settings.speakingStyle);
        const feedbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: feedback,
          timestamp: new Date(),
          score
        };

        setMessages(prev => [...prev, feedbackMessage]);

        // 다음 질문
        if (currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            const nextQuestionIndex = currentQuestionIndex + 1;
            const nextQuestion: Message = {
              id: (Date.now() + 2).toString(),
              type: 'ai',
              content: questions[nextQuestionIndex],
              timestamp: new Date()
            };
            setMessages(prev => [...prev, nextQuestion]);
            setCurrentQuestionIndex(nextQuestionIndex);
            setIsAiSpeaking(false);
            
            // 다음 음성 모달 자동 표시
            if (settings.mode === 'voice' && settings.maxSpeakingTime) {
              setTimeout(() => {
                setVoiceTimeLeft(settings.maxSpeakingTime!);
                setShowVoiceModal(true);
                setIsRecording(true);
              }, 1000);
            }
          }, 1000);
        } else {
          setIsAiSpeaking(false);
        }
      }, 3000);
    }, 100);
  };

  const generateFeedback = (score: number, style: 'friend' | 'interviewer') => {
    const friendlyFeedbacks = {
      high: [
        `정말 훌륭한 답변이에요! (${score}점) 기술적 이해도가 높고 실무 경험이 잘 드러나서 이해하기 쉬웠어요. 구체적인 예시까지 포함해주셔서 더욱 생생하게 느껴졌습니다.`,
        `와, 정말 좋은 설명이었어요! (${score}점) 복잡한 기술적 내용을 이렇게 쉽게 풀어서 설명해주시니까 저도 이해가 잘 되네요. 실제 경험담이 포함되어 있어서 더욱 인상적이었습니다.`,
        `완벽한 답변이셨어요! (${score}점) 이론적인 부분뿐만 아니라 실제 적용 경험까지 구체적으로 말씀해주셔서 정말 도움이 되었어요.`
      ],
      medium: [
        `좋은 답변이었어요! (${score}점) 기본적인 이해는 잘 되어 있는 것 같은데, 혹시 구체적인 예시나 실제 경험담을 조금 더 추가해주실 수 있을까요?`,
        `잘 설명해주셨어요! (${score}점) 이론적인 부분은 충분히 이해하신 것 같은데, 실무에서 어떻게 적용하셨는지 구체적인 사례가 있으면 더 완벽할 것 같아요.`,
        `괜찮은 답변이셨어요! (${score}점) 전반적으로 이해하고 계신 것 같은데, 기술적 세부사항이나 경험담을 조금 더 보완해주시면 더 좋을 것 같아요.`
      ]
    };

    const interviewerFeedbacks = {
      high: [
        `우수한 답변입니다. (${score}점) 기술적 이해도가 뛰어나고 실무 경험이 체계적으로 잘 정리되어 있습니다. 구체적인 사례와 함께 문제 해결 과정을 명확히 제시해주셨습니다.`,
        `매우 인상적인 답변이었습니다. (${score}점) 기술적 깊이와 실무 적용 능력을 모두 보여주셨고, 논리적으로 체계화된 설명이 돋보였습니다.`,
        `탁월한 답변입니다. (${score}점) 이론과 실무의 균형이 잘 잡혀있고, 구체적인 경험을 바탕으로 한 설명이 매우 설득력 있었습니다.`
      ],
      medium: [
        `양호한 답변입니다. (${score}점) 기본적인 이해도는 충분하나, 실무 적용 사례나 구체적인 경험담을 보완해주시면 더욱 완성도 높은 답변이 될 것 같습니다.`,
        `적절한 답변입니다. (${score}점) 전반적인 이해는 되어 있으나, 기술적 세부사항이나 실제 구현 경험에 대한 설명을 추가해주시기 바랍니다.`,
        `무난한 답변입니다. (${score}점) 이론적 이해는 확인되었으나, 실무에서의 적용 방법이나 트러블슈팅 경험 등을 구체적으로 제시해주시면 좋겠습니다.`
      ]
    };

    const feedbacks = style === 'friend' ? friendlyFeedbacks : interviewerFeedbacks;
    const category = score >= 90 ? 'high' : 'medium';
    return feedbacks[category][Math.floor(Math.random() * feedbacks[category].length)];
  };

  const handleInterviewEnd = () => {
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    onComplete(averageScore, messages);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* 고정된 프로그래스 바 */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto py-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">실전 면접</h2>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant={settings.mode === 'voice' ? 'default' : 'secondary'}>
                {settings.mode === 'voice' ? '음성 모드' : '채팅 모드'}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* 컨텐츠 영역 (프로그래스 바 높이만큼 여백 추가) */}
      <div className="mt-24">
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* 채팅 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI 로딩 중일 때 */}
              {isAiSpeaking && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted mr-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-muted-foreground" />
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">답변을 준비하고 있어요...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'ai' && <Bot className="h-5 w-5 mt-0.5 text-muted-foreground" />}
                      {message.type === 'user' && <User className="h-5 w-5 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.score && (
                          <Badge className="mt-2" variant="secondary">
                            점수: {message.score}점
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 영역 */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="답변을 입력하세요..."
                  onKeyPress={(e) => e.key === 'Enter' && !isAiSpeaking && handleSendMessage()}
                  className="flex-1"
                  disabled={isAiSpeaking || settings.mode === 'voice'}
                />
                {settings.mode === 'chat' && (
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim() || isAiSpeaking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 음성 녹음 모달 */}
      <Dialog open={showVoiceModal} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>답변을 말씀하세요</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <p className="text-lg font-semibold mb-2">남은 시간</p>
            <p className="text-3xl font-bold text-red-600">{formatTime(voiceTimeLeft)}</p>
            <Progress value={((settings.maxSpeakingTime! - voiceTimeLeft) / settings.maxSpeakingTime!) * 100} className="mt-4" />
          </div>
          <Button onClick={handleVoiceComplete}>
            답변 완료
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
