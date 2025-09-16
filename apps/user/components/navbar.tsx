"use client";

// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
// import { Button } from "../components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "../components/ui/dropdown-menu";
// import { Menu, School } from "lucide-react";
// import DarkMode from "./darkmode";
// import {
//   Sheet,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetContent,
// } from "../components/ui/sheet";
// import { Separator } from "@radix-ui/react-dropdown-menu";

// export default function Navbar() {
//   const { data: session } = useSession();

//   return (
//     <div className="w-full dark:bg-[#4e4848] bg-white flex h-14 border-b dark:border-gray-800 border-b-gray-300 fixed top-0 left-0 right-0 z-10 duration-300">

//       {/* Desktop Nav */}
//       <div className="hidden md:flex max-w-7xl w-full mx-auto px-4 md:px-6 justify-between items-center h-full">
//         <div className="flex items-center gap-2">
//           <School />
//           <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//             SkillNest
//           </h1>
//         </div>
//         <div className="flex items-center gap-6">
//           {session?.user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar aria-label="User menu">
//                   <AvatarImage
//                     src={session.user.photoUrl ?? "https://github.com/shadcn.png"}
//                   />
//                   <AvatarFallback>
//                     {session.user.name?.[0] ?? "U"}
//                   </AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuGroup>
//                   <Link href="/profile">
//                     <DropdownMenuItem>Profile</DropdownMenuItem>
//                   </Link>
//                   <Link href="/mylearning">
//                     <DropdownMenuItem>My Courses</DropdownMenuItem>
//                   </Link>
//                   <DropdownMenuItem>Settings</DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => signOut()}>
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Button variant="outline" asChild>
//               <Link href="/signup">Sign In</Link>
//             </Button>
//           )}
//           <DarkMode />
//         </div>
//       </div>

//       {/* Mobile Nav */}
//       <div className="flex md:hidden w-full items-center justify-between px-4">
//         <div className="flex items-center gap-2">
//           <School className="h-6 w-6 text-gray-800 dark:text-white" />
//           <h1 className="text-lg font-bold text-gray-800 dark:text-white">
//             SkillNest
//           </h1>
//         </div>
//         <MobileNavBar />
//       </div>
//     </div>
//   );
// }

// const MobileNavBar = () => {
//   const { data: session } = useSession();

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="rounded-full shadow-sm bg-gray-100 hover:bg-gray-200 border-gray-300 dark:border-gray-700"
//         >
//           <Menu className="h-5 w-5 font-semibold" />
//         </Button>
//       </SheetTrigger>

//       <SheetContent side="right" className="w-72 p-5 space-y-6">
//         <SheetHeader className="flex flex-row items-center justify-between mb-2">
//           <SheetTitle className="text-lg font-semibold text-gray-800 dark:text-white">
//             Menu
//           </SheetTitle>
//           <DarkMode />
//         </SheetHeader>

//         <Separator className="mb-2" />

//         <nav className="flex flex-col space-y-3">
//           <Link href="/mylearning">
//             <span className="text-sm font-semibold hover:text-primary cursor-pointer transition-colors">
//               My Space
//             </span>
//           </Link>
//           <Link href="/profile">
//             <span className="text-sm font-semibold hover:text-primary cursor-pointer transition-colors">
//               Edit Profile
//             </span>
//           </Link>
//           <span className="text-sm font-semibold hover:text-primary cursor-pointer transition-colors">
//             Settings
//           </span>

//           <Button variant="outline" className="w-full" onClick={() => signOut()}>
//             Log Out
//           </Button>
//         </nav>

//         {/* Optional Teacher Dashboard */}
//         {/* {session?.user?.role === "teacher" && (
//           <SheetFooter className="mt-4">
//             <Button asChild>
//               <Link href="/teacher/dashboard">Teacher Dashboard</Link>
//             </Button>
//           </SheetFooter>
//         )} */}
//       </SheetContent>
//     </Sheet>
//   );
// };



// "use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Search, Bell, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function CitizenDashboard() {
  const { data: session } = useSession();
  const user = session?.user 
  console.log(session);

  return (
   <div className="bg-background">
      {/* Header with User Info */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl">Sahaayak</h1>
              <p className="text-sm text-muted-foreground">
                Crowdsourced civic issue reporting & resolution system
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                {user?.role === 'citizen' ? (
                  <User className="w-4 h-4 text-blue-500" />
                ) : user?.role === 'superadmin' ? (
                  <Shield className="w-4 h-4 text-red-500" />
                ) : (
                  <Shield className="w-4 h-4 text-orange-500" />
                )}
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    user?.role === 'superadmin' 
                      ? 'bg-red-100 text-red-700' 
                      : user?.role === 'subadmin'
                      ? 'bg-orange-100 text-orange-700'
                      : ''
                  }`}
                >
                  {user?.role === 'superadmin' 
                    ? 'Super Admin' 
                    : user?.role === 'subadmin' 
                    ? 'Sub Admin' 
                    : 'Citizen'}
                </Badge>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function handleLogout() {
  // Implement logout logic here
  console.log("Logout clicked");
}
