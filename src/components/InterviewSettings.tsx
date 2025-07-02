
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, MessageCircle, Mic, User, Briefcase } from 'lucide-react';

interface InterviewSettingsProps {
  onStart: (settings: {
    duration: number;
    speakingStyle: 'friend' | 'interviewer';
    mode: 'voice' | 'chat';
    maxSpeakingTime?: number;
  }) => void;
  onBack: () => void;
}

export function InterviewSettings({ onStart, onBack }: InterviewSettingsProps) {
  const [duration, setDuration] = useState(10);
  const [speakingStyle, setSpeakingStyle] = useState<'friend' | 'interviewer'>('interviewer');
  const [mode, setMode] = useState<'voice' | 'chat'>('chat');
  const [maxSpeakingTime, setMaxSpeakingTime] = useState(2);

  const durationOptions = [
    { value: 5, label: '5분' },
    { value: 10, label: '10분' },
    { value: 15, label: '15분' }
  ];

  const styleOptions = [
    {
      value: 'friend',
      label: '비개발자 친구',
      description: '친근하고 이해하기 쉽게 설명을 요구하는 스타일',
      icon: User
    },
    {
      value: 'interviewer',
      label: '면접관',
      description: '전문적이고 체계적인 답변을 요구하는 스타일',
      icon: Briefcase
    }
  ];

  const modeOptions = [
    {
      value: 'chat',
      label: '채팅 모드',
      description: '텍스트로 질문하고 답변하는 방식',
      icon: MessageCircle
    },
    {
      value: 'voice',
      label: '음성 모드',
      description: '음성으로 질문하고 답변하는 방식',
      icon: Mic
    }
  ];

  const handleStart = () => {
    onStart({
      duration,
      speakingStyle,
      mode,
      maxSpeakingTime: mode === 'voice' ? maxSpeakingTime : undefined
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">실전 면접 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              면접 시간
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {durationOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={duration === option.value ? 'default' : 'outline'}
                  className="h-12"
                  onClick={() => setDuration(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>면접관 스타일</Label>
            <TooltipProvider>
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Tooltip key={option.value}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={speakingStyle === option.value ? 'default' : 'outline'}
                          className="h-16 flex-col gap-2"
                          onClick={() => setSpeakingStyle(option.value as 'friend' | 'interviewer')}
                        >
                          <IconComponent className="h-5 w-5" />
                          {option.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{option.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            <Label>면접 방식</Label>
            <TooltipProvider>
              <div className="grid grid-cols-2 gap-3">
                {modeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Tooltip key={option.value}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={mode === option.value ? 'default' : 'outline'}
                          className="h-16 flex-col gap-2"
                          onClick={() => setMode(option.value as 'voice' | 'chat')}
                        >
                          <IconComponent className="h-5 w-5" />
                          {option.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{option.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {mode === 'voice' && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <Label>최대 답변 시간 (분)</Label>
              <div className="flex gap-2">
                {[1, 2].map((time) => (
                  <Button
                    key={time}
                    variant={maxSpeakingTime === time ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMaxSpeakingTime(time)}
                  >
                    {time}분
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              이전
            </Button>
            <Button onClick={handleStart}>
              면접 시작
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
