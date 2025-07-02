
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Archive, Calendar, Clock, Trophy, Eye, Trash2 } from 'lucide-react';

interface ArchiveItem {
  id: string;
  date: string;
  score: number;
  documentData: {
    type: 'link' | 'text';
    content: string;
  };
  settings: {
    duration: number;
    speakingStyle: 'friend' | 'interviewer';
    mode: 'voice' | 'chat';
  };
}

export function ArchivePage() {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    const savedArchive = JSON.parse(localStorage.getItem('interview-archive') || '[]');
    setArchiveItems(savedArchive.reverse()); // 최신순으로 정렬
  }, []);

  const deleteItem = (id: string) => {
    const updatedItems = archiveItems.filter(item => item.id !== id);
    setArchiveItems(updatedItems);
    localStorage.setItem('interview-archive', JSON.stringify(updatedItems.reverse()));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDocumentPreview = (documentData: ArchiveItem['documentData']) => {
    if (documentData.type === 'link') {
      return `링크: ${documentData.content}`;
    }
    return documentData.content.length > 100 
      ? `${documentData.content.substring(0, 100)}...`
      : documentData.content;
  };

  if (archiveItems.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Archive className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">아카이브가 비어있습니다</h2>
          <p className="text-muted-foreground">
            실전 면접을 완료하고 저장하시면 여기에 기록이 남습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">면접 아카이브</h2>
        <p className="text-muted-foreground">
          지금까지 진행한 {archiveItems.length}개의 면접 기록입니다.
        </p>
      </div>

      <div className="grid gap-4">
        {archiveItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`px-3 py-1 font-semibold ${getScoreColor(item.score)}`}>
                      <Trophy className="h-4 w-4 mr-1" />
                      {item.score}점
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.date)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {item.settings.duration}분
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">
                      {item.settings.speakingStyle === 'friend' ? '비개발자 친구' : '면접관'}
                    </Badge>
                    <Badge variant="outline">
                      {item.settings.mode === 'voice' ? '음성 모드' : '채팅 모드'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {getDocumentPreview(item.documentData)}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          면접 상세 정보 - {item.score}점
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">면접 정보</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">일시:</span>
                              <p>{formatDate(item.date)}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">소요시간:</span>
                              <p>{item.settings.duration}분</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">면접관 유형:</span>
                              <p>{item.settings.speakingStyle === 'friend' ? '비개발자 친구' : '면접관'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">모드:</span>
                              <p>{item.settings.mode === 'voice' ? '음성 모드' : '채팅 모드'}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">사용된 문서</h4>
                          <div className="p-3 bg-muted rounded-lg text-sm">
                            <p className="text-muted-foreground mb-1">
                              {item.documentData.type === 'link' ? '링크' : '직접 입력'}:
                            </p>
                            <p className="break-words">{item.documentData.content}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
