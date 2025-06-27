'use client';

import type { FullAnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Frown, Link as LinkIcon, Meh, MessageSquare, Smile, User } from 'lucide-react';

interface AnalysisResultProps {
  result: FullAnalysisResult;
}

const getSentimentIcon = (sentiment?: string) => {
  const s = sentiment?.toLowerCase() || '';
  if (s.includes('positive') || s.includes('good') || s.includes('happy')) {
    return <Smile className="h-6 w-6 text-green-500" />;
  }
  if (s.includes('negative') || s.includes('bad') || s.includes('sad') || s.includes('angry') || s.includes('concerned')) {
    return <Frown className="h-6 w-6 text-red-500" />;
  }
  return <Meh className="h-6 w-6 text-gray-500" />;
};


export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Extracted Article Link</CardTitle>
        </CardHeader>
        <CardContent>
          {result.articleLink ? (
            <a
              href={result.articleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline underline-offset-4"
            >
              <LinkIcon className="h-4 w-4" />
              <span>{result.articleLink}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ) : (
            <p className="text-muted-foreground">No article link was found in the transcript.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <User className="h-5 w-5" />
              Agent 1 Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-5 w-5" />
                <span>Messages Sent</span>
              </div>
              <Badge variant="secondary" className="text-lg">{result.agent1MessageCount}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Overall Sentiment</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{result.agent1Sentiment}</span>
                {getSentimentIcon(result.agent1Sentiment)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <User className="h-5 w-5" />
              Agent 2 Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-5 w-5" />
                <span>Messages Sent</span>
              </div>
              <Badge variant="secondary" className="text-lg">{result.agent2MessageCount}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Overall Sentiment</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{result.agent2Sentiment}</span>
                {getSentimentIcon(result.agent2Sentiment)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
