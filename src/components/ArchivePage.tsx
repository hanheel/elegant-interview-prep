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

const generateMockData = (): ArchiveItem[] => {
  return [
    {
      id: 'mock-interview-1',
      type: 'interview',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
      score: 85,
      documentData: {
        type: 'text',
        content: 'React, JavaScript, TypeScript에 대한 기술 면접 준비 자료입니다. Virtual DOM의 작동 원리와 React Hooks의 사용법에 대해 학습했습니다.'
      },
      settings: {
        duration: 30,
        speakingStyle: 'interviewer',
        mode: 'chat'
      },
      chatHistory: [
        {
          id: '1',
          type: 'ai',
          content: '안녕하세요! 오늘 React 개발자 면접을 진행하겠습니다. 먼저 React의 Virtual DOM에 대해 설명해 주시겠어요?',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'user',
          content: 'Virtual DOM은 실제 DOM을 JavaScript 객체로 표현한 가상의 DOM입니다. React에서는 상태가 변경될 때마다 새로운 Virtual DOM 트리를 생성하고, 이전 트리와 비교하여 변경된 부분만 실제 DOM에 반영합니다.',
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'ai',
          content: '좋은 답변입니다! 그렇다면 React Hooks 중 useState와 useEffect의 차이점에 대해 설명해 주세요.',
          timestamp: new Date()
        }
      ],
      document: `# React 기술 면접 학습 기록

## 학습 개요
- **학습 일시**: ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
- **면접 형태**: 기술 면접관과의 대화
- **소요 시간**: 30분
- **최종 점수**: 85점

## 주요 학습 내용

### 1. Virtual DOM 개념 이해
**면접관 질문**: "React의 Virtual DOM에 대해 설명해 주시겠어요?"

**학습자 답변**: Virtual DOM은 실제 DOM을 JavaScript 객체로 표현한 가상의 DOM입니다. React에서는 상태가 변경될 때마다 새로운 Virtual DOM 트리를 생성하고, 이전 트리와 비교하여 변경된 부분만 실제 DOM에 반영합니다.

**핵심 학습 포인트**:
- Virtual DOM의 기본 개념과 작동 원리 이해
- 성능 최적화 관점에서의 Virtual DOM 역할
- Diffing 알고리즘에 대한 기초 지식

### 2. React Hooks 심화 학습
**면접관 질문**: "useState와 useEffect의 차이점에 대해 설명해 주세요."

**핵심 학습 포인트**:
- State 관리 Hook과 Side Effect Hook의 구분
- 각 Hook의 사용 시점과 최적 활용법
- Hook 규칙과 주의사항

## 학습 성과 분석

### 강점
1. **기술적 기반**: React 핵심 개념에 대한 탄탄한 이해
2. **설명 능력**: 복잡한 개념을 명확하게 설명하는 능력
3. **실무 연결**: 이론과 실제 개발 경험의 연결

### 성장 영역
1. **심화 학습**: 더 고급 React 패턴과 최적화 기법
2. **실무 경험**: 다양한 프로젝트 경험 사례 보강
3. **최신 기술**: React 18의 새로운 기능들에 대한 학습

## 다음 학습 목표
- React 18의 Concurrent Features 학습
- 상태 관리 라이브러리 (Redux, Zustand) 심화
- 성능 최적화 기법 실습
- 테스팅 전략 및 도구 활용법`
    },
    {
      id: 'mock-practice-1',
      type: 'practice',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
      score: 78,
      documentData: {
        type: 'link',
        content: 'https://developer.mozilla.org/ko/docs/Web/JavaScript'
      },
      settings: {
        questionCount: 10,
        difficulty: 'medium'
      },
      practiceData: {
        questionsAnswered: 10,
        averageScore: 78,
        totalTime: 1200
      },
      document: `# JavaScript 기초 연습 학습 기록

## 학습 개요
- **학습 일시**: ${new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
- **연습 유형**: 중급 난이도 문제 풀이
- **문제 수**: 10문제
- **평균 점수**: 78점

## 연습 문제 및 학습 내용

### 1. 호이스팅(Hoisting) 개념
**문제**: JavaScript의 호이스팅에 대해 설명하고, var, let, const의 차이점을 서술하시오.

**학습 포인트**:
- 호이스팅의 정의와 동작 원리
- 변수 선언 키워드별 호이스팅 차이점
- TDZ(Temporal Dead Zone) 개념

### 2. 클로저(Closure) 활용
**문제**: 클로저를 활용한 모듈 패턴의 예시를 작성하고 설명하시오.

**학습 포인트**:
- 클로저의 정의와 생성 조건
- 실무에서의 클로저 활용 사례
- 메모리 관리와 주의사항

### 3. 비동기 처리
**문제**: Promise와 async/await의 차이점과 적절한 사용 시기를 설명하시오.

**학습 포인트**:
- 비동기 처리의 필요성
- Promise 체이닝 vs async/await 문법
- 에러 핸들링 방법

## 학습 성과 분석

### 잘한 부분
- 기본 개념에 대한 이해도가 높음
- 실무 예시를 통한 설명 능력
- 문제 해결 접근 방식이 체계적

### 개선이 필요한 부분
- 고급 JavaScript 개념에 대한 깊이 있는 학습
- 브라우저 환경과 Node.js 환경의 차이점 이해
- 성능 최적화 관련 지식 보완

## 추천 학습 방향
1. ES6+ 최신 문법 및 기능 심화 학습
2. 함수형 프로그래밍 패러다임 이해
3. 브라우저 API 및 웹 표준 학습
4. 실제 프로젝트를 통한 실습 경험 확대`
    },
    {
      id: 'mock-interview-2',
      type: 'interview',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1주일 전
      score: 92,
      documentData: {
        type: 'text',
        content: 'Node.js와 Express.js를 활용한 백엔드 개발에 대한 면접 준비입니다. RESTful API 설계와 데이터베이스 연동에 대해 학습했습니다.'
      },
      settings: {
        duration: 45,
        speakingStyle: 'friend',
        mode: 'voice'
      },
      chatHistory: [
        {
          id: '1',
          type: 'ai',
          content: '백엔드 개발 경험에 대해 말해줄래? 특히 Node.js로 어떤 프로젝트를 해봤는지 궁금해!',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'user',
          content: 'Node.js와 Express.js를 사용해서 커뮤니티 사이트의 백엔드를 개발한 경험이 있어요. JWT를 이용한 인증 시스템과 MongoDB를 연동한 RESTful API를 구현했습니다.',
          timestamp: new Date()
        }
      ],
      document: `# Node.js 백엔드 개발 면접 학습 기록

## 학습 개요
- **학습 일시**: ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
- **면접 형태**: 친구와의 편안한 대화 형식
- **소요 시간**: 45분 (음성 모드)
- **최종 점수**: 92점

## 주요 대화 내용

### 1. 백엔드 개발 경험 공유
**질문**: "백엔드 개발 경험에 대해 말해줄래?"

**답변 요약**: Node.js와 Express.js를 사용한 커뮤니티 사이트 백엔드 개발 경험을 공유했습니다. JWT 인증 시스템과 MongoDB 연동 RESTful API 구현에 대해 설명했습니다.

**핵심 학습 포인트**:
- 실제 프로젝트 경험을 통한 기술 스택 이해
- 인증/인가 시스템 구현 경험
- NoSQL 데이터베이스 활용 능력

### 2. API 설계 철학
**논의 주제**: RESTful API 설계 원칙과 실무 적용

**핵심 내용**:
- REST API 설계 원칙 준수
- HTTP 메서드의 적절한 사용
- 상태 코드를 통한 명확한 응답 처리
- API 문서화의 중요성

### 3. 성능 최적화 경험
**논의 주제**: 대용량 트래픽 처리를 위한 최적화 방안

**학습 포인트**:
- 데이터베이스 쿼리 최적화
- 캐싱 전략 수립
- 비동기 처리를 통한 성능 개선

## 학습 성과

### 우수한 점
1. **실무 경험**: 실제 프로젝트를 통한 풍부한 경험
2. **기술 이해도**: 백엔드 기술 스택에 대한 깊은 이해
3. **문제 해결**: 실무에서 발생한 문제들에 대한 해결 경험
4. **커뮤니케이션**: 기술적 내용을 명확하게 전달하는 능력

### 향후 발전 방향
1. **마이크로서비스**: 대규모 시스템 아키텍처 설계 경험
2. **DevOps**: CI/CD 파이프라인 구축 및 배포 자동화
3. **보안**: 웹 보안 취약점 분석 및 대응 방안
4. **모니터링**: 시스템 모니터링 및 로그 분석 도구 활용

이번 면접을 통해 백엔드 개발자로서의 역량과 경험이 매우 우수함을 확인할 수 있었습니다.`
    },
    {
      id: 'mock-practice-2',
      type: 'practice',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
      score: 65,
      documentData: {
        type: 'text',
        content: 'CSS와 웹 접근성에 대한 기초 학습 자료입니다. Flexbox, Grid 레이아웃과 반응형 웹 디자인에 대해 공부했습니다.'
      },
      settings: {
        questionCount: 5,
        difficulty: 'easy'
      },
      practiceData: {
        questionsAnswered: 5,
        averageScore: 65,
        totalTime: 600
      },
      document: `# CSS 기초 연습 학습 기록

## 학습 개요
- **학습 일시**: ${new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
- **연습 유형**: 쉬운 난이도 기초 문제
- **문제 수**: 5문제
- **평균 점수**: 65점

## 연습 내용

### 1. CSS 레이아웃 기초
**문제**: Flexbox와 CSS Grid의 차이점과 각각의 적합한 사용 사례를 설명하시오.

**학습 내용**:
- Flexbox: 1차원 레이아웃에 적합 (행 또는 열 기준)
- CSS Grid: 2차원 레이아웃에 적합 (행과 열 동시 제어)
- 각각의 속성과 활용 방법

### 2. 반응형 웹 디자인
**문제**: 미디어 쿼리를 사용한 반응형 디자인의 기본 원리를 설명하시오.

**학습 포인트**:
- 브레이크포인트 설정 방법
- 모바일 퍼스트 vs 데스크톱 퍼스트 접근법
- 반응형 이미지와 타이포그래피

### 3. 웹 접근성 기초
**문제**: 웹 접근성을 고려한 CSS 작성 방법을 제시하시오.

**학습 내용**:
- 색상 대비와 가독성
- 포커스 상태 표시
- 스크린 리더 고려사항

## 학습 성과 분석

### 성장한 부분
- CSS 기본 개념에 대한 이해 향상
- 레이아웃 시스템에 대한 체계적 접근
- 웹 표준과 접근성에 대한 인식 개선

### 보완이 필요한 부분
- CSS 전처리기 (Sass, Less) 활용법
- CSS-in-JS 라이브러리 이해
- 애니메이션과 트랜지션 고급 기법
- 성능 최적화를 위한 CSS 작성법

## 다음 학습 계획
1. CSS 애니메이션과 트랜지션 심화 학습
2. 모던 CSS 기능 (CSS Variables, CSS Modules) 실습
3. 디자인 시스템 구축을 위한 CSS 설계 방법론
4. 크로스 브라우저 호환성 테스트 및 대응 방안`
    }
  ];
};

export function ArchivePage() {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const savedArchive = JSON.parse(localStorage.getItem('interview-archive') || '[]');
    
    // 저장된 아카이브가 없으면 목 데이터 사용
    if (savedArchive.length === 0) {
      const mockData = generateMockData();
      setArchiveItems(mockData);
      // 목 데이터도 localStorage에 저장해서 일관성 유지
      localStorage.setItem('interview-archive', JSON.stringify(mockData));
    } else {
      setArchiveItems(savedArchive.reverse()); // 최신순으로 정렬
    }
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
