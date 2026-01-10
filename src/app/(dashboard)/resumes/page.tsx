'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { FileText, Upload, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { uploadResume, getUserResumes, deleteResume } from '@/actions/resume';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ResumeScoreDashboard } from '@/components/resume/ResumeScoreDashboard';

interface Resume {
  id: string;
  fileName: string;
  createdAt: Date;
  analyzedAt: Date | null;
  isDefault: boolean;
  analysis: any;
}

export default function ResumesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedResumeId, setExpandedResumeId] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please upload a file less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const content = new TextDecoder().decode(arrayBuffer);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadResume({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        content: content.substring(0, 10000),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: 'Resume Uploaded',
          description: 'Your resume has been analyzed successfully',
        });
        setSelectedFile(null);
        loadResumes();
      } else {
        toast({
          title: 'Upload Failed',
          description: result.error || 'Failed to upload resume',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: 'Upload Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const loadResumes = async () => {
    try {
      const result = await getUserResumes();
      if (result.success && result.data) {
        setResumes(result.data as Resume[]);
        if (result.data.length > 0 && !expandedResumeId) {
          setExpandedResumeId(result.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const result = await deleteResume(resumeId);
      if (result.success) {
        toast({
          title: 'Resume Deleted',
          description: 'The resume has been removed',
        });
        loadResumes();
      } else {
        toast({
          title: 'Delete Failed',
          description: result.error || 'Failed to delete resume',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold">Resume Analysis</h1>
        <p className="text-muted-foreground">
          Upload your resume to get AI-powered feedback and improvement suggestions
        </p>
      </div>

      <Card className="mb-12 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>Upload your resume in PDF format for AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            {selectedFile ? (
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse (PDF only, max 5MB)
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-4">
              {isUploading ? (
                <div>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    Analyzing your resume...
                  </p>
                </div>
              ) : (
                <Button onClick={handleUpload} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Analyze Resume
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Resumes</h2>
        {resumes.map(resume => (
          <Card
            key={resume.id}
            className={cn(
              'overflow-hidden transition-all',
              expandedResumeId === resume.id ? 'ring-2 ring-primary' : ''
            )}
          >
            <div
              className="flex cursor-pointer items-center justify-between border-b bg-card/50 p-4 transition-colors hover:bg-muted/50"
              onClick={() => setExpandedResumeId(expandedResumeId === resume.id ? null : resume.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{resume.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {resume.analysis && (
                  <div className="hidden text-right sm:block">
                    <span className="text-sm font-medium text-primary">
                      {resume.analysis.overallScore}/100
                    </span>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(resume.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
                {expandedResumeId === resume.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedResumeId === resume.id && (
              <div className="p-6">
                {resume.analysis ? (
                  <ResumeScoreDashboard analysis={resume.analysis} />
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Analysis in progress...
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
