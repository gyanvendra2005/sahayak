"use client"

import { useSession } from "next-auth/react";

import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import CourseCard from "../../../components/CourseCard";
import { Skeleton } from "../../../components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



export default function ProfilePage() {
  const { data: session, status,update } = useSession();
    const [open, setOpen] = useState(false);
  const noCourses = 3;
    const [name, setName] = useState(session?.user.name);
  const [email, setEmail] = useState(session?.user.email);
  const [profileimage, setProfile] = useState("")
  console.log(name,email);
  console.log(session);
  const [IsLoading,setIsLoading] = useState(false);
  const router = useRouter();
  

  const handleImageChange =(e :any)=>{
   const file = e.target.files?.[0];
   if(file) setProfile(file)
  }
console.log(profileimage);



  

const saveProfile = async () => {

    setIsLoading(true);

//  FORM DATA



  try {

     const formData = new FormData();
      formData.append("name",name || "");
      formData.append("email", email || "");
      formData.append("image",profileimage);


    const response = await axios.put("/api/editprofile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    if (response.status === 200) {
      // Re-fetch the updated session from server
      await update();
        toast.success("Profile Updated")
    //   toast({
    //     title: "Profile Updated",
    //     description: "Your profile has been updated successfully.",
    //   });
    }
  } catch (error) {
    console.error(error);
    toast.error("Update failed")
    // toast({
    //   title: "Update failed",
    //   description: "There was a problem updating your profile.",
    // });
  }
  setIsLoading(false);
};



  if (status === "loading") {
    return <ProfileSkeleton />;
  }

//   if(open){
//     <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Profile</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <Input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Name"
//             />
//             <Input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               disabled
//             />
//             <Button>Save Changes</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//   }


if (status === "unauthenticated") {
    toast.message("Need to login")
    router.push("/signup");
  return null;
}


  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 my-20">
      <h1 className="font-bold text-2xl text-center md:text-left mb-6">👤 Profile</h1>
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <Avatar className="h-32 w-32 md:h-40 md:w-40 shadow-lg border">
          <AvatarImage
            src={session?.user.photoUrl ?? "https://github.com/shadcn.png"}
            alt="User Avatar"
          />
          <AvatarFallback>{session?.user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left space-y-3">
          <div className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Name:</span> {session?.user.name ?? "Gyanvendra"}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Email:</span> {session?.user.email ?? "gyan@example.com"}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Role:</span> Student
          </div>
          <Button onClick={() => setOpen(true)} className="mt-3">Edit Profile</Button>
        </div>
      </div>


{/*  edit function */}

       <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      {/* Avatar Preview and File Upload */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={session?.user.photoUrl || "https://github.com/shadcn.png"}
            alt="Profile"
          />
          <AvatarFallback>{name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Name & Email Fields */}
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled
      />

      <Button disabled={IsLoading} onClick={()=>saveProfile()} >
         {IsLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating ...
                    </span>
                  ) : (
                    "Update"
                  )}
      </Button>
    </div>
  </DialogContent>
</Dialog>


      {/* Enrolled Courses */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-4">📚 Enrolled Courses</h2>
        {noCourses === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(noCourses)].map((_, i) => (
              <CourseCard key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// skelaton
const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto my-10 space-y-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Skeleton */}
        <div className="flex flex-col gap-6 w-full md:w-2/3">
          <div className="flex gap-6 items-center">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex flex-col gap-3 w-full">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Activity Skeleton */}
        <div className="w-full md:w-1/3 space-y-4">
          <Skeleton className="h-6 w-32 mb-2" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

