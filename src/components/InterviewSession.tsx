
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Clock, Mic, MicOff, Send, User, Bot } from 'lucide-react';

interface InterviewSessionProps {
  documentData: { type: 'link' | 'text'; content: string };
  settings: {
    duration: number;
    speakingStyle: 'friend' | 'interviewer';
    mode: 'voice' | 'chat';
    maxSpeakingTime?: number;
  };
  onComplete: (score: number) => void;
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
    "안녕! 개발 공부하면서 가장 재미있었던 프로젝트가 뭐야?",
    "그 기술을 왜 선택했는지 궁금해! 다른 방법도 있었을 텐데",
    "개발하면서 가장 어려웠던 버그는 뭐였어? 어떻게 해결했어?",
    "팀 프로젝트 할 때 어떤 역할을 주로 맡았어?",
    "앞으로 어떤 개발자가 되고 싶어?"
  ],
  interviewer: [
    "본인의 주요 프로젝트 경험에 대해 설명해주세요.",
    "사용하신 기술 스택을 선택한 이유는 무엇인가요?",
    "개발 중 발생한 기술적 문제를 어떻게 해결하셨나요?",
    "팀워크에서 본인의 역할과 기여도를 설명해주세요.",
    "향후 커리어 목표와 성장 계획을 말씀해주세요."
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

  const questions = mockQuestions[settings.speakingStyle];
  const totalDuration = settings.duration * 60;

  useEffect(() => {
    // 첫 질문 자동 전송
    const firstMessage: Message = {
      id: '1',
      type: 'ai',
      content: questions[0],
      timestamp: new Date()
    };
    setMessages([firstMessage]);

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
            setShowVoiceModal(false);
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

    // AI 피드백 및 다음 질문 생성
    setTimeout(() => {
      const score = Math.floor(Math.random() * 21) + 80; // 80-100점 랜덤
      setScores(prev => [...prev, score]);

      const feedback = generateFeedback(score);
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
        }, 1000);
      }
    }, 1500);
  };

  const handleVoiceStart = () => {
    setVoiceTimeLeft((settings.maxSpeakingTime || 2) * 60);
    setShowVoiceModal(true);
    setIsRecording(true);
  };

  const handleVoiceComplete = () => {
    setIsRecording(false);
    // 음성을 텍스트로 변환 (모의)
    const mockTranscription = "음성으로 답변한 내용이 여기에 표시됩니다. 실제 구현에서는 음성 인식 API를 사용하여 변환됩니다.";
    setInputValue(mockTranscription);
  };

  const generateFeedback = (score: number) => {
    const feedbacks = {
      high: [
        `훌륭한 답변입니다! (${score}점) 기술적 이해도가 높고 실무 경험이 잘 드러났습니다.`,
        `매우 좋습니다! (${score}점) 구체적인 예시와 함께 명확하게 설명해주셨네요.`,
        `완벽한 답변입니다! (${score}점) 깊이 있는 기술적 이해를 보여주셨습니다.`
      ],
      medium: [
        `좋은 답변입니다! (${score}점) 조금 더 구체적인 예시가 있으면 더 좋을 것 같아요.`,
        `잘 답변해주셨습니다! (${score}점) 실무 경험과 연결해서 설명하시면 더 완벽할 것 같아요.`,
        `괜찮은 답변입니다! (${score}점) 기술적 세부사항을 조금 더 추가하시면 좋겠어요.`
      ]
    };

    const category = score >= 90 ? 'high' : 'medium';
    return feedbacks[category][Math.floor(Math.random() * feedbacks[category].length)];
  };

  const handleInterviewEnd = () => {
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    onComplete(averageScore);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
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

      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* 채팅 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              {settings.mode === 'voice' && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceStart}
                  className={isRecording ? 'bg-red-100 hover:bg-red-200' : ''}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 음성 녹음 모달 */}
      <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
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
            <Progress value={((settings.maxSpeakingTime! * 60 - voiceTimeLeft) / (settings.maxSpeakingTime! * 60)) * 100} className="mt-4" />
          </div>
          <Button onClick={() => {
            setShowVoiceModal(false);
            setIsRecording(false);
            handleVoiceComplete();
          }}>
            녹음 중지
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
