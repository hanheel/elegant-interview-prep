
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target } from 'lucide-react';

interface ModeSelectionProps {
  onModeSelect: (mode: 'practice' | 'interview') => void;
}

export function ModeSelection({ onModeSelect }: ModeSelectionProps) {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          기술 면접 도우미
        </h1>
        <p className="text-xl text-muted-foreground">
          연습 모드와 실전 모드 중 선택해보세요
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          onClick={() => onModeSelect('practice')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">연습 모드</CardTitle>
            <CardDescription className="text-base">
              문서를 바탕으로 질문을 받고 즉시 피드백을 받아보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• 문서 기반 질문 생성</li>
              <li>• 즉시 피드백 제공</li>
              <li>• 꼬리 질문으로 심화 학습</li>
              <li>• 난이도 선택 가능</li>
            </ul>
            <Button 
              className="w-full" 
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onModeSelect('practice');
              }}
            >
              연습 모드 시작
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          onClick={() => onModeSelect('interview')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
              <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">실전 모드</CardTitle>
            <CardDescription className="text-base">
              실제 면접과 같은 환경에서 연습해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• 실시간 대화형 면접</li>
              <li>• 음성/채팅 모드 선택</li>
              <li>• 다양한 면접관 스타일</li>
              <li>• 종합 평가 및 아카이브</li>
            </ul>
            <Button 
              className="w-full" 
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onModeSelect('interview');
              }}
            >
              실전 모드 시작
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
