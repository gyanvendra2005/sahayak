"use client";

// 0YKhrwUq6I4cLcyk
// mongodb+srv://gyanvendras2004:0YKhrwUq6I4cLcyk@cluster0.eb5d9sf.mongodb.net/

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { set } from "mongoose";
import { Loader2 } from "lucide-react";

export default function AuthTabs() {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [issumitted, setIsSubmitted] = useState(false);
  const { data: session } = useSession();
  const [role, setRole] = useState<string | null>(null);

  const router = useRouter();

  // Handle input changes for login and signup forms

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupInput((prev) => ({ ...prev, [name]: value }));
  };
  console.log("Login Input:", loginInput);
  console.log("Signup Input:", signupInput);
  console.log("Session Data:", session);

  // signin process
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Add login logic here
    const response = await signIn("credentials", {
      redirect: false,
      email: loginInput.email,
      password: loginInput.password,
    });
    if (response?.error) {
      console.log("error");
      toast.error("Invalid credentials. Please try again.");
    } else {
      console.log("login");
      toast.success("Logged in successfully!");
    }
    if (response?.url) {
      // router.replace('/dashboad');
    }
    setIsSubmitted(false);

    console.log(response);
    console.log("Logging in with:", loginInput);
  };

  // sign up process
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Add signup logic here
    try {
      console.log("Signing up with:", signupInput);
      const response = await axios.post("/api/signup", signupInput);
      toast.success("Signed up successfully! Please log in.");
      // if(response.data.success){
      //   router.replace(`/signin`)
      // }
    } catch (error) {
      console.log("Error in sign up of user", error);
      if (axios.isAxiosError(error)) {
        // Handle specific error from the API
        toast.error(
          error.response?.data.message || "Signup failed. Please try again."
        );
      } else {
        // Handle other errors
        toast.error("An unexpected error occurred. Please try again.");
      }

      console.log("Signing up with:", signupInput);
    }
    setIsSubmitted(false);
  };

  return (
    <>
      <div className="flex w-full h-screen items-center justify-center bg-gray-50 mt-15">
        <Tabs defaultValue="signup" className="w-[400px]">
          <TabsList className="w-full">
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="signin">Login</TabsTrigger>
          </TabsList>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign-Up</CardTitle>
                <CardDescription>
                  Welcome to our platform! Please fill in your details to create
                  an account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    onChange={handleSignupChange}
                    placeholder="Eg. Gyanvendra Singh"
                    required
                    name="name"
                    value={signupInput.name}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={handleSignupChange}
                    placeholder="Eg. gyani0007@gmail.com"
                    required
                    name="email"
                    value={signupInput.email}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={handleSignupChange}
                    placeholder="Eg. xyz"
                    required
                    name="password"
                    value={signupInput.password}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="role">Select Role</Label>
                  <select
                    id="role"
                    name="role"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                    required
                    value={role || ""}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setSignupInput((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }));
                    }} // update signupInput with selected role
                    // onChange={handleSignupChange} // optional handler
                  >
                    <option value="">-- Select Role --</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    {/* <option value="admin">Admin</option> */}
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={issumitted}
                  onClick={handleSignupSubmit}
                >
                  {issumitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing up...
                    </span>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Signin Tab */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign-In</CardTitle>
                <CardDescription>
                  Welcome back! Please enter your credentials to access your
                  account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    onChange={handleLoginChange}
                    type="email"
                    placeholder="Eg. gyani0007@gmail.com"
                    required
                    name="email"
                    value={loginInput.email}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    onChange={handleLoginChange}
                    type="password"
                    placeholder="Eg. xyz"
                    required
                    name="password"
                    value={loginInput.password}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={issumitted}
                  onClick={handleLoginSubmit}
                  className="w-full"
                >
                  {issumitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
