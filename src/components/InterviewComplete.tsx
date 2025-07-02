
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Archive, Home } from 'lucide-react';

interface InterviewCompleteProps {
  score: number;
  onSaveToArchive: () => void;
  onHome: () => void;
}

export function InterviewComplete({ score, onSaveToArchive, onHome }: InterviewCompleteProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return '훌륭합니다!';
    if (score >= 80) return '잘했습니다!';
    if (score >= 70) return '괜찮습니다!';
    return '더 노력하세요!';
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">면접 완료!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-lg mb-2">평균 점수</p>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-2xl text-muted-foreground">점</span>
            </div>
            <p className={`text-lg font-medium mt-2 ${getScoreColor(score)}`}>
              {getScoreText(score)}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground">
              이 면접 결과를 아카이브에 저장하시겠습니까?
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={onSaveToArchive} className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                아카이브에 저장
              </Button>
              <Button variant="outline" onClick={onHome} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                홈으로 가기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
