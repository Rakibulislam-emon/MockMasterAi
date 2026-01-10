'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { FileText, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { uploadResume, getUserResumes, deleteResume } from '@/actions/resume';
import { useToast } from '@/hooks/use-toast';

interface Resume {
  id: string;
  fileName: string;
  createdAt: Date;
  analyzedAt: Date | null;
  isDefault: boolean;
  analysis: {
    overallScore: number | null;
    atsScore: number | null;
  } | null;
}

export default function ResumesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file
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
      // Read file content
      const arrayBuffer = await selectedFile.arrayBuffer();
      const content = new TextDecoder().decode(arrayBuffer);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadResume({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        content: content.substring(0, 10000), // Limit content for demo
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: 'Resume Uploaded',
          description: 'Your resume has been analyzed successfully',
        });
        setSelectedFile(null);
        // Refresh resumes list
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

  // Load resumes on mount
  require('react').useEffect(() => {
    loadResumes();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold">Resume Analysis</h1>
        <p className="text-muted-foreground">
          Upload your resume to get AI-powered feedback and improvement suggestions
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>Upload your resume in PDF format for AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
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

      {/* Resume List */}
      {resumes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resumes</CardTitle>
            <CardDescription>Previously uploaded resumes and their analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resumes.map(resume => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between rounded-lg border p-4"
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

                  <div className="flex items-center gap-4">
                    {resume.analysis ? (
                      <div className="flex gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {resume.analysis.overallScore || '--'}
                          </p>
                          <p className="text-xs text-muted-foreground">Overall</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {resume.analysis.atsScore || '--'}
                          </p>
                          <p className="text-xs text-muted-foreground">ATS Score</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Analyzing...</span>
                    )}

                    <Button variant="ghost" size="icon" onClick={() => handleDelete(resume.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
