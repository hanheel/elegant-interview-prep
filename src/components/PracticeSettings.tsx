
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PracticeSettingsProps {
  onStart: (settings: { questionCount: number; difficulty: 'easy' | 'medium' | 'hard' }) => void;
  onBack: () => void;
}

export function PracticeSettings({ onStart, onBack }: PracticeSettingsProps) {
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const difficultyOptions = [
    {
      value: 'easy',
      label: '쉬움',
      description: '기본적인 개념과 간단한 구현 위주의 질문',
      color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    },
    {
      value: 'medium',
      label: '보통',
      description: '실무 경험과 심화 개념을 묻는 질문',
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
    },
    {
      value: 'hard',
      label: '고급',
      description: '복잡한 시스템 설계와 고급 개념 질문',
      color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
    }
  ];

  const handleStart = () => {
    onStart({ questionCount, difficulty });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">연습 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-count">질문 개수 (최대 10개)</Label>
            <Input
              id="question-count"
              type="number"
              min="1"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.min(10, Math.max(1, Number(e.target.value))))}
            />
          </div>

          <div className="space-y-3">
            <Label>난이도 선택</Label>
            <TooltipProvider>
              <div className="grid grid-cols-3 gap-3">
                {difficultyOptions.map((option) => (
                  <Tooltip key={option.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-16 ${
                          difficulty === option.value
                            ? option.color
                            : 'hover:' + option.color.split(' ')[0] + ' hover:' + option.color.split(' ')[1]
                        }`}
                        onClick={() => setDifficulty(option.value as 'easy' | 'medium' | 'hard')}
                      >
                        {option.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{option.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              이전
            </Button>
            <Button onClick={handleStart}>
              연습 시작
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
