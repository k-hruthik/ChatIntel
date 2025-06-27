'use client';

import { useState, useEffect } from 'react';
import { summarizeChat } from '@/ai/flows/summarize-chat';
import { analyzeAgentSentiment } from '@/ai/flows/analyze-agent-sentiment';
import { extractArticleLink } from '@/ai/flows/extract-article-link';
import type { FullAnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2, PlayCircle } from 'lucide-react';
import AnalysisResult from '@/components/analysis-result';

type Message = {
  message: string;
  agent: string;
  sentiment: string;
  knowledge_source: string[];
  turn_rating: string;
};

type Transcript = {
  article_url: string;
  config: string;
  content: Message[];
};

type DataSet = {
  [id: string]: Transcript;
};

export default function Home() {
  const [dataset, setDataset] = useState<DataSet | null>(null);
  const [transcriptIds, setTranscriptIds] = useState<string[]>([]);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<FullAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/dataset.json');
        if (!response.ok) {
          throw new Error('Failed to fetch dataset');
        }
        const data: DataSet = await response.json();
        setDataset(data);
        const ids = Object.keys(data);
        setTranscriptIds(ids);
        if (ids.length > 0) {
          setSelectedTranscriptId(ids[0]);
        }
      } catch (error) {
        console.error('Error loading dataset:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the sample dataset. Please check the console for details.',
        });
      }
    }
    loadData();
  }, [toast]);

  const formatTranscript = (messages: Message[]): string => {
    return messages.map(msg => `${msg.agent}: ${msg.message}`).join('\n');
  };

  const handleAnalyze = async () => {
    if (!dataset || !selectedTranscriptId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No transcript selected or dataset not loaded.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const transcriptData = dataset[selectedTranscriptId];
      const formattedTranscript = formatTranscript(transcriptData.content);

      // 1. Calculate message counts locally
      const agent1MessageCount = transcriptData.content.filter(m => m.agent === 'agent_1').length;
      const agent2MessageCount = transcriptData.content.filter(m => m.agent === 'agent_2').length;

      // 2. Run modular AI flows in parallel
      const [summaryResult, sentimentResult, linkResult] = await Promise.all([
        summarizeChat({ transcript: formattedTranscript }),
        analyzeAgentSentiment({ transcript: transcriptData.content.map(({ agent, message }) => ({ agent, message })) }),
        extractArticleLink({ transcript: formattedTranscript })
      ]);
      
      // 3. Combine results into a single object for the UI
      const combinedResult: FullAnalysisResult = {
        summary: summaryResult.summary,
        articleLink: linkResult.articleLink,
        agent1MessageCount,
        agent2MessageCount,
        agent1Sentiment: sentimentResult.agent1Sentiment,
        agent2Sentiment: sentimentResult.agent2Sentiment,
      };

      setAnalysisResult(combinedResult);

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An error occurred during analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <BrainCircuit className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline text-gray-900 dark:text-gray-100">AgentInsight</h1>
            <p className="text-muted-foreground">AI-Powered Chat Transcript Analysis</p>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Analyze a Chat Transcript</CardTitle>
            <CardDescription>Select a transcript from the dataset to analyze with AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedTranscriptId}
                onValueChange={setSelectedTranscriptId}
                disabled={isLoading || !dataset}
              >
                <SelectTrigger className="flex-grow">
                  <SelectValue placeholder="Select a transcript..." />
                </SelectTrigger>
                <SelectContent>
                  {transcriptIds.map(id => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAnalyze} disabled={isLoading || !selectedTranscriptId} className="sm:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="mr-2 h-4 w-4" />
                )}
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Analyzing transcript... this may take a moment.</p>
          </div>
        )}

        {analysisResult && (
          <div className="mt-8">
            <AnalysisResult result={analysisResult} />
          </div>
        )}
      </div>
    </main>
  );
}
