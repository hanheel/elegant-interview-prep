
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Target, Archive, FileText } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: BookOpen },
    { id: 'practice', label: '연습 모드', icon: Target },
    { id: 'interview', label: '실전 모드', icon: Target },
    { id: 'documents', label: '문서 저장소', icon: FileText },
    { id: 'archive', label: '아카이브', icon: Archive },
  ];

  return (
    <Card className="p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </Card>
  );
}
