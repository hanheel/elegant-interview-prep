
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ExternalLink, FileCheck } from 'lucide-react';

export function DocumentsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">문서 저장소</h2>
        <p className="text-muted-foreground mb-8">
          자주 사용하는 문서를 저장하고 관리할 수 있는 공간입니다.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExternalLink className="h-5 w-5" />
                링크 문서
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notion, 블로그, GitHub README 등의 링크를 저장하여 
                면접 준비에 활용할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5" />
                텍스트 문서
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                직접 작성한 프로젝트 설명, 기술 스택 정리 등을 
                텍스트로 저장하고 재사용할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          이 기능은 곧 구현될 예정입니다. 현재는 면접을 진행할 때마다 문서를 입력해주세요.
        </p>
      </div>
    </div>
  );
}
