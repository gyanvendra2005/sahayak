// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Filter, Search, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
// import axios from 'axios';
// import IssuesMap from 'components/map';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// interface Issue {
//   _id: string;
//   category: string;
//   description: string;
//   status: 'pending' | 'Acknowledged' | 'in-progress' | 'Resolved';
//   priority: 'low' | 'medium' | 'high';
//   timestamp: string;
//   location: string;
//   department: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
//   ticketId: string;
//   citizenId: string;
//   assignedWorker?: string;
//   lat: number;
//   lng: number;
//   image?: string;
// }

// interface AdminDashboardProps {
//   userType?: 'SubAdmin' | 'SuperAdmin';
//   assignedArea?: string;
// }

// export default function AdminDashboard({
//   userType = 'SuperAdmin',
//   assignedArea
// }: AdminDashboardProps) {
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [filterCategory, setFilterCategory] = useState<string>('all');
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const {data:session} = useSession();
//       const [searchQuery, setSearchQuery] = React.useState("");
//   // 🔹 Fetch issues from backend
//   useEffect(() => {
//     const fetchIssues = async () => {
//       // department
//       const department = session?.user?.department || '';
//       try {
//         console.log('Fetching issues for department:', department);
        
//        const res = await axios.get(`/api/issues`,{ params: { department } });
//         console.log('Fetched issues:', res.data);
        
//         setIssues(res.data.data || []);
//       } catch (err) {
//         console.error('Error fetching issues:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssues();
//   }, [session]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'resolved': return 'text-green-600 bg-green-50';
//       case 'in-progress': return 'text-yellow-600 bg-yellow-50';
//       case 'acknowledged': return 'text-blue-600 bg-blue-50';
//       default: return 'text-red-600 bg-red-50';
//     }
//   };

//   // Filter issues by area (for SubAdmin)
//   const areaFilteredIssues =
//     userType === 'SubAdmin' && assignedArea
//       ? issues.filter((issue) =>
//           issue.location?.toLowerCase().includes(assignedArea.toLowerCase())
//         )
//       : issues;

//  const filteredIssues = React.useMemo(() => {
//   if (!issues) return [];

//   return issues.filter((issue) => {
//     // Category filter
//     const matchesCategory =
//       filterCategory === 'all' || issue.category === filterCategory;

//     // Status filter
//     const matchesStatus =
//       filterStatus === 'all' || issue.status === filterStatus;

//     // Search filter (check ticketId, id, description)
//     const query = searchQuery?.toLowerCase() || '';
//     const matchesSearch =
//       !query ||
//       issue.ticketId?.toLowerCase().includes(query) ||
//       issue._id?.toLowerCase().includes(query) ||
//       issue.description?.toLowerCase().includes(query);

//     return matchesCategory && matchesStatus && matchesSearch;
//   });
// }, [issues, filterCategory, filterStatus, searchQuery]);


//   const stats = {
//     total: areaFilteredIssues.length,
//     pending: areaFilteredIssues.filter((i) => i.status !== 'Resolved').length,
//     inProgress: areaFilteredIssues.filter((i) => i.status === 'Acknowledged').length,
//     resolved: areaFilteredIssues.filter((i) => i.status === 'Resolved').length,
//     highPriority: areaFilteredIssues.filter((i) => i.priority === 'high').length
//   };

//   return (
//     <div className="flex w-full h-screen bg-gray-50">
//       <div className="flex-1 flex flex-col lg:flex-row">
//         {/* Map Section */}
//         <div className="flex-1 p-4">
//           <Card className="h-full">
//             <CardHeader className="pb-3">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <CardTitle>
//                   Issues Map
//                   {userType === 'SubAdmin' && assignedArea && (
//                     <span className="text-sm font-normal text-muted-foreground ml-2">
//                       - {assignedArea} Area
//                     </span>
//                   )}
//                 </CardTitle>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 sm:flex gap-2">
//                   <Badge variant="outline" className="flex items-center gap-1">
//                     <AlertTriangle className="w-3 h-3 text-red-500" />
//                     {stats.pending} Pending
//                   </Badge>
//                   <Badge variant="outline" className="flex items-center gap-1">
//                     <Clock className="w-3 h-3 text-yellow-500" />
//                     {stats.inProgress} Active
//                   </Badge>
//                   <Badge variant="outline" className="flex items-center gap-1 sm:hidden lg:flex">
//                     <CheckCircle className="w-3 h-3 text-green-500" />
//                     {stats.resolved} Resolved
//                   </Badge>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="p-4">
//               {loading ? (
//                 <p className="text-gray-500">Loading issues...</p>
//               ) : (
//                  <IssuesMap
//               issues={[
//                 {
//                   id: "1",
//                   category: "potholes",
//                   description: "Huge pothole near market",
//                   lat: 30.6139,
//                   lng: 77.209,
//                   location: "Connaught Place",
//                 },
//                 {
//                   id: "2",
//                   category: "garbage",
//                   description: "Garbage not collected",
//                   lat: 28.62,
//                   lng: 77.21,
//                   location: "Karol Bagh",
//                 },
//                 {
//                   id: "3",
//                   category: "streetlight",
//                   description: "Streetlight not working",
//                   lat: 28.625,
//                   lng: 77.215,
//                   location: "Rajiv Chowk",
//                 },
//               ]}
//             />
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Side Panel */}
//         <div className="w-full lg:w-96 p-4 lg:pl-0 lg:overflow-y-auto">
//           <div className="space-y-4">
//             {/* Filters */}
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <Filter className="w-4 h-4" />
//                   Filters
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                      {/* Search */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               placeholder="Search by ticket ID..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </CardContent>
//       </Card>

//                 <Select value={filterCategory} onValueChange={setFilterCategory}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Categories</SelectItem>
//                     <SelectItem value="potholes">Potholes</SelectItem>
//                     <SelectItem value="streetlight">Street Light</SelectItem>
//                     <SelectItem value="garbage">Garbage</SelectItem>
//                     <SelectItem value="water">Water Issues</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <Select value={filterStatus} onValueChange={setFilterStatus}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="acknowledged">Acknowledged</SelectItem>
//                     <SelectItem value="in-progress">In Progress</SelectItem>
//                     <SelectItem value="resolved">Resolved</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>

//             {/* Issues List */}
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle>Recent Reports</CardTitle>
//               </CardHeader>
             
//                    <CardContent className="p-0">
//                 <div className="max-h-96 overflow-y-auto">
//                   {loading ? (
//                     <p className="p-4 text-gray-500">Loading...</p>
//                   ) : filteredIssues.length > 0 ? (
//                     filteredIssues.map((issue) => (
//                       <Link href={`detailissue/${issue._id}`}>
//                       <div
//                         key={issue._id}
//                         className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <p className="font-medium">#{issue.ticketId}</p>
//                             <p className="text-sm text-muted-foreground capitalize">
//                               {issue.category}
//                             </p>
//                             <p className="text-sm text-muted-foreground capitalize">
//                               {issue.department}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
//                               {issue.status}
//                             </Badge>
//                           </div>
//                         </div>

//                         <p className="text-sm mb-2 line-clamp-2">{issue.description}</p>

//                         <div className="flex justify-between items-center text-xs text-muted-foreground">
//                           <span>{issue.location}</span>
//                           <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                       </Link>
//                     ))
//                   ) : (
//                     <p className="p-4 text-gray-500">No issues found</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             {/* <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4" />
//                   Today's Stats
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4 text-center">
//                   <div>
//                     <p className="text-2xl text-red-600">{stats.pending}</p>
//                     <p className="text-xs text-muted-foreground">New Reports</p>
//                   </div>
//                   <div>
//                     <p className="text-2xl text-green-600">{stats.resolved}</p>
//                     <p className="text-xs text-muted-foreground">Resolved</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import IssuesMap from 'components/map';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Issue {
  _id: string;
  category: string;
  description: string;
  status: 'pending' | 'Acknowledged' | 'in-progress' | 'Resolved';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  location: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  ticketId: string;
  citizenId: string;
  assignedWorker?: string;
  lat: number;
  lng: number;
  image?: string;
}

export default function Page() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();

  // 🔹 make state instead of props
  const [userType] = useState<'SubAdmin' | 'SuperAdmin'>('SuperAdmin');
  const [assignedArea] = useState<string | undefined>(undefined);

  // 🔹 Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      const department = session?.user?.department || '';
      try {
        console.log('Fetching issues for department:', department);
        const res = await axios.get(`/api/issues`, { params: { department } });
        console.log('Fetched issues:', res.data);
        setIssues(res.data.data || []);
      } catch (err) {
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50';
      case 'acknowledged': return 'text-blue-600 bg-blue-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  // Filter issues by area (for SubAdmin)
  const areaFilteredIssues =
    userType === 'SubAdmin' && assignedArea
      ? issues.filter((issue) =>
          issue.location?.toLowerCase().includes(assignedArea.toLowerCase())
        )
      : issues;

  const filteredIssues = React.useMemo(() => {
    if (!issues) return [];

    return issues.filter((issue) => {
      const matchesCategory =
        filterCategory === 'all' || issue.category === filterCategory;

      const matchesStatus =
        filterStatus === 'all' || issue.status === filterStatus;

      const query = searchQuery?.toLowerCase() || '';
      const matchesSearch =
        !query ||
        issue.ticketId?.toLowerCase().includes(query) ||
        issue._id?.toLowerCase().includes(query) ||
        issue.description?.toLowerCase().includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [issues, filterCategory, filterStatus, searchQuery]);

  const stats = {
    total: areaFilteredIssues.length,
    pending: areaFilteredIssues.filter((i) => i.status !== 'Resolved').length,
    inProgress: areaFilteredIssues.filter((i) => i.status === 'Acknowledged').length,
    resolved: areaFilteredIssues.filter((i) => i.status === 'Resolved').length,
    highPriority: areaFilteredIssues.filter((i) => i.priority === 'high').length
  };

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Section */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>
                  Issues Map
                  {userType === 'SubAdmin' && assignedArea && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      - {assignedArea} Area
                    </span>
                  )}
                </CardTitle>

                <div className="grid grid-cols-2 sm:flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    {stats.pending} Pending
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-yellow-500" />
                    {stats.inProgress} Active
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 sm:hidden lg:flex">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {stats.resolved} Resolved
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <p className="text-gray-500">Loading issues...</p>
              ) : (
                <IssuesMap
                  issues={[
                    {
                      id: "1",
                      category: "potholes",
                      description: "Huge pothole near market",
                      lat: 30.6139,
                      lng: 77.209,
                      location: "Connaught Place",
                    },
                    {
                      id: "2",
                      category: "garbage",
                      description: "Garbage not collected",
                      lat: 28.62,
                      lng: 77.21,
                      location: "Karol Bagh",
                    },
                    {
                      id: "3",
                      category: "streetlight",
                      description: "Streetlight not working",
                      lat: 28.625,
                      lng: 77.215,
                      location: "Rajiv Chowk",
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-96 p-4 lg:pl-0 lg:overflow-y-auto">
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search */}
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by ticket ID..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="potholes">Potholes</SelectItem>
                    <SelectItem value="streetlight">Street Light</SelectItem>
                    <SelectItem value="garbage">Garbage</SelectItem>
                    <SelectItem value="water">Water Issues</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Issues List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <p className="p-4 text-gray-500">Loading...</p>
                  ) : filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <Link href={`detailissue/${issue._id}`} key={issue._id}>
                        <div
                          className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">#{issue.ticketId}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {issue.category}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {issue.department}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                                {issue.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm mb-2 line-clamp-2">{issue.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{issue.location}</span>
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500">No issues found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
