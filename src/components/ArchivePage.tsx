import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Calendar, Clock, Trophy, Eye, Trash2, User, Bot, BookOpen, Zap, Loader2, FileText, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  score?: number;
}

interface InterviewArchiveItem {
  id: string;
  type: 'interview';
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
  chatHistory?: Message[];
  document?: string; // AI 생성 문서 추가
}

interface PracticeArchiveItem {
  id: string;
  type: 'practice';
  date: string;
  score: number;
  documentData: {
    type: 'link' | 'text';
    content: string;
  };
  settings: {
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  practiceData?: {
    questionsAnswered: number;
    averageScore: number;
    totalTime: number;
  };
  document?: string; // AI 생성 문서 추가
}

type ArchiveItem = InterviewArchiveItem | PracticeArchiveItem;

export function ArchivePage() {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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

  const handleViewDetail = (item: ArchiveItem) => {
    setSelectedItem(item);
    setIsLoadingDetail(true);
    setShowDetailModal(true);
    
    // 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoadingDetail(false);
    }, 1500);
  };

  const handleCardClick = (item: ArchiveItem) => {
    // 문서가 있으면 바로 문서 보기, 없으면 상세 보기
    if (item.document) {
      setSelectedItem(item);
      setIsLoadingDetail(false);
      setShowDetailModal(true);
    } else {
      handleViewDetail(item);
    }
  };

  const interviewItems = archiveItems.filter(item => item.type === 'interview') as InterviewArchiveItem[];
  const practiceItems = archiveItems.filter(item => item.type === 'practice') as PracticeArchiveItem[];

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
            실전 면접이나 연습을 완료하고 저장하시면 여기에 기록이 남습니다.
          </p>
        </div>
      </div>
    );
  }

  const renderArchiveCard = (item: ArchiveItem) => (
    <Card 
      key={item.id} 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => handleCardClick(item)}
    >
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
              {item.type === 'interview' && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {item.settings.duration}분
                </div>
              )}
              {item.document && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  AI 문서
                </Badge>
              )}
            </div>

            <div className="flex gap-2 mb-3">
              <Badge variant="outline">
                {item.type === 'interview' ? '실전 면접' : '연습 모드'}
              </Badge>
              {item.type === 'interview' ? (
                <>
                  <Badge variant="outline">
                    {item.settings.speakingStyle === 'friend' ? '비개발자 친구' : '면접관'}
                  </Badge>
                  <Badge variant="outline">
                    {item.settings.mode === 'voice' ? '음성 모드' : '채팅 모드'}
                  </Badge>
                </>
              ) : (
                <>
                  <Badge variant="outline">
                    {item.settings.questionCount}문제
                  </Badge>
                  <Badge variant="outline">
                    {item.settings.difficulty === 'easy' ? '쉬움' : 
                     item.settings.difficulty === 'medium' ? '보통' : '고급'}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.document ? 
                `AI가 생성한 ${item.type === 'interview' ? '면접 분석' : '연습 분석'} 문서를 확인하실 수 있습니다.` :
                getDocumentPreview(item.documentData)
              }
            </p>
          </div>

          <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" onClick={() => handleViewDetail(item)}>
              <Eye className="h-4 w-4 mr-1" />
              상세보기
            </Button>
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
  );

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">아카이브</h2>
        <p className="text-muted-foreground">
          지금까지 진행한 {archiveItems.length}개의 기록입니다.
        </p>
      </div>

      <Tabs defaultValue="interview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            실전 면접 ({interviewItems.length})
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            연습 모드 ({practiceItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interview" className="space-y-4">
          {interviewItems.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">실전 면접 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {interviewItems.map(renderArchiveCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          {practiceItems.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">연습 모드 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {practiceItems.map(renderArchiveCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 상세보기 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem?.document ? (
                <FileText className="h-5 w-5" />
              ) : selectedItem?.type === 'interview' ? (
                <Zap className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
              {selectedItem?.document ? 
                `AI 분석 문서 - ${selectedItem?.score}점` :
                `${selectedItem?.type === 'interview' ? '실전 면접' : '연습 모드'} 상세 정보 - ${selectedItem?.score}점`
              }
            </DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">기록을 불러오고 있습니다...</p>
              </div>
            </div>
          ) : selectedItem && (
            <div className="space-y-6">
              {selectedItem.document ? (
                // AI 생성 문서 표시
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">AI 생성 분석 문서</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      이 문서는 AI가 {selectedItem.type === 'interview' ? '면접' : '연습'} 내용을 분석하여 자동으로 생성한 리포트입니다.
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap font-mono text-sm bg-background border rounded-lg p-6">
                    {selectedItem.document}
                  </div>
                </div>
              ) : (
                // 기존 상세 정보 표시
                <>
                  <div>
                    <h4 className="font-semibold mb-2">기본 정보</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">일시:</span>
                        <p>{formatDate(selectedItem.date)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">점수:</span>
                        <p>{selectedItem.score}점</p>
                      </div>
                      {selectedItem.type === 'interview' ? (
                        <>
                          <div>
                            <span className="text-muted-foreground">소요시간:</span>
                            <p>{selectedItem.settings.duration}분</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">면접관 유형:</span>
                            <p>{selectedItem.settings.speakingStyle === 'friend' ? '비개발자 친구' : '면접관'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">모드:</span>
                            <p>{selectedItem.settings.mode === 'voice' ? '음성 모드' : '채팅 모드'}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-muted-foreground">문제 수:</span>
                            <p>{selectedItem.settings.questionCount}문제</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">난이도:</span>
                            <p>{selectedItem.settings.difficulty === 'easy' ? '쉬움' : 
                               selectedItem.settings.difficulty === 'medium' ? '보통' : '고급'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">사용된 문서</h4>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p className="text-muted-foreground mb-1">
                        {selectedItem.documentData.type === 'link' ? '링크' : '직접 입력'}:
                      </p>
                      <p className="break-words">{selectedItem.documentData.content}</p>
                    </div>
                  </div>

                  {selectedItem.type === 'interview' && selectedItem.chatHistory && selectedItem.chatHistory.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">면접 대화 기록</h4>
                      <div className="max-h-96 overflow-y-auto border rounded-lg p-4 space-y-3">
                        {selectedItem.chatHistory.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                message.type === 'user'
                                  ? 'bg-primary text-primary-foreground ml-4'
                                  : 'bg-muted mr-4'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {message.type === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-muted-foreground" />}
                                {message.type === 'user' && <User className="h-4 w-4 mt-0.5" />}
                                <div className="flex-1">
                                  <p>{message.content}</p>
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
                    </div>
                  )}

                  {selectedItem.type === 'practice' && (
                    <div>
                      <h4 className="font-semibold mb-2">연습 요약</h4>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          이 연습 세션에서는 {selectedItem.settings.questionCount}개의 질문을 통해 
                          {selectedItem.settings.difficulty === 'easy' ? '기초' : 
                           selectedItem.settings.difficulty === 'medium' ? '중급' : '고급'} 수준의 
                          기술 면접을 연습하셨습니다.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-3 bg-background rounded">
                            <p className="text-2xl font-bold text-primary">{selectedItem.score}</p>
                            <p className="text-xs text-muted-foreground">평균 점수</p>
                          </div>
                          <div className="text-center p-3 bg-background rounded">
                            <p className="text-2xl font-bold text-primary">{selectedItem.settings.questionCount}</p>
                            <p className="text-xs text-muted-foreground">완료한 문제</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
