"use client";
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, AlertCircle, Search, Phone } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Issue {
  id: string;
  category: string;
  ticketId: string;
  description: string;
  status: 'sumitted' | 'acknowledged' | 'in-progress' | 'resolved';
  createdAt: string;
  updates?: Array<{
    status: string;
    timestamp: string;
    message: string;
  }>;
}

interface TrackIssueProps {
  issues: Issue[];
}

export default function TrackIssue() {

  const {data:session} = useSession();
  const userId = session?.user?.id;
  console.log(userId);
  
  const [issues, setIssues] = React.useState<Issue[]>();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'acknowledged':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'acknowledged': return 'bg-blue-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Submited': return 'Submitted';
      case 'acknowledged': return 'Acknowledged';
      case 'in-progress': return 'Work Assigned';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const statusSteps = ['Submited', 'acknowledged', 'in-progress', 'resolved'];
// if(userId){
  useEffect(() => {
    const fectchedIssues = async()=>{
    try {
       const response  = await axios.get('/api/fetchissues',{params:{userId}});
        console.log(response.data.issues);
        setIssues(response.data.issues);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch issues");
    }
  }
  fectchedIssues();
},[userId]);
// }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl mb-2">Track My Issues</h1>
        <p className="text-muted-foreground">Monitor the progress of your reported issues</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ticket ID..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {issues?.map((issue) => {
          const currentStepIndex = statusSteps.indexOf(issue.status);
          
          return (
            <Card key={issue.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Ticket #{issue.ticketId}
                      {getStatusIcon(issue.status)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {issue.category} • {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(issue.status)} text-white border-0`}>
                    {getStatusText(issue.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{issue.description}</p>
                
                {/* Timeline */}
                <div className="space-y-4">
                  <h4>Progress Timeline</h4>
                  <div className="flex justify-between">
                    {statusSteps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            index <= currentStepIndex 
                              ? `${getStatusColor(step)} border-transparent text-white` 
                              : 'border-gray-300 text-gray-400'
                          }`}
                        >
                          {index <= currentStepIndex ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        <span className="text-xs mt-2 text-center">
                          {getStatusText(step)}
                        </span>
                        {index < statusSteps.length - 1 && (
                          <div 
                            className={`h-0.5 w-full mt-4 ${
                              index < currentStepIndex ? getStatusColor(step) : 'bg-gray-300'
                            }`} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Support */}
      <Card>
        <CardContent className="p-4 text-center">
          <Phone className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <h3 className="mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contact our support team for assistance
          </p>
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}