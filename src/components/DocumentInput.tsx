
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Link, FileText } from 'lucide-react';

interface DocumentInputProps {
  onContinue: (documentData: { type: 'link' | 'text'; content: string }) => void;
  onBack: () => void;
}

export function DocumentInput({ onContinue, onBack }: DocumentInputProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [activeTab, setActiveTab] = useState('link');

  const canContinue = () => {
    return activeTab === 'link' ? linkUrl.trim() !== '' : textContent.trim() !== '';
  };

  const handleContinue = () => {
    if (canContinue()) {
      onContinue({
        type: activeTab as 'link' | 'text',
        content: activeTab === 'link' ? linkUrl : textContent
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">문서 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                문서 링크
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                직접 입력
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-input">Notion, 블로그 등의 문서 링크를 입력하세요</Label>
                <Input
                  id="link-input"
                  placeholder="https://notion.so/... 또는 https://blog.example.com/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">면접 질문의 기반이 될 내용을 입력하세요</Label>
                <Textarea
                  id="text-input"
                  placeholder="기술 스택, 프로젝트 경험, 학습 내용 등을 입력해주세요..."
                  className="min-h-[200px]"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onBack}>
              이전
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!canContinue()}
            >
              다음 단계
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
