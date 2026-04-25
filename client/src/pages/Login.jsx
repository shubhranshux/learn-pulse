import { Loader2, LogIn, UserPlus, Mail, Lock, User, GraduationCap, BookOpenCheck } from "lucide-react"
import Logo from "@/components/Logo"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "../features/api/authApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();
  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful. Please login.");
      // Redirect to login tab after successful registration
      setActiveTab("login");
      setSignupInput({ name: "", email: "", password: "", role: "student" });
    }
    if (registerError) {
      toast.error(registerError.data?.message || "Signup Failed");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login Successful.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data?.message || "Login Failed");
    }
  }, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mt-16">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#6366f1]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl gradient-bg shadow-xl mb-3 sm:mb-4 animate-pulse-glow">
            <Logo size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight gradient-text">LearnPulse</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Your gateway to knowledge</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl h-11 sm:h-12 p-1 bg-muted/60">
            <TabsTrigger value="signup" className="rounded-lg font-semibold data-[state=active]:shadow-md transition-all duration-300 text-sm sm:text-base">
              <UserPlus size={16} className="mr-1.5 sm:mr-2" />
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="login" className="rounded-lg font-semibold data-[state=active]:shadow-md transition-all duration-300 text-sm sm:text-base">
              <LogIn size={16} className="mr-1.5 sm:mr-2" />
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card className="border-border/50 shadow-xl rounded-2xl mt-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold">Create Account</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Join thousands of learners. Start your journey today.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="signup-name" className="font-medium text-sm">Full Name</Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      name="name"
                      value={signupInput.name}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Your full name"
                      className="pl-10 h-10 sm:h-11 rounded-xl text-sm"
                      required={true} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email" className="font-medium text-sm">Email</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      name="email"
                      value={signupInput.email}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="you@example.com"
                      className="pl-10 h-10 sm:h-11 rounded-xl text-sm"
                      required={true} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password" className="font-medium text-sm">Password</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      name="password"
                      value={signupInput.password}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      placeholder="Min. 6 characters"
                      className="pl-10 h-10 sm:h-11 rounded-xl text-sm"
                      required={true} />
                  </div>
                </div>

                {/* Role Selector */}
                <div className="grid gap-2">
                  <Label className="font-medium text-sm">Register as</Label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupInput({ ...signupInput, role: "student" })}
                      className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        signupInput.role === "student"
                          ? "border-[#6366f1] bg-[#6366f1]/5 shadow-md"
                          : "border-border hover:border-[#6366f1]/30 hover:bg-muted/50"
                      }`}
                    >
                      <GraduationCap size={22} className={signupInput.role === "student" ? "text-[#6366f1]" : "text-muted-foreground"} />
                      <span className={`text-xs sm:text-sm font-semibold ${signupInput.role === "student" ? "text-[#6366f1]" : "text-muted-foreground"}`}>Student</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground text-center leading-tight">Browse & learn courses</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupInput({ ...signupInput, role: "instructor" })}
                      className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        signupInput.role === "instructor"
                          ? "border-[#6366f1] bg-[#6366f1]/5 shadow-md"
                          : "border-border hover:border-[#6366f1]/30 hover:bg-muted/50"
                      }`}
                    >
                      <BookOpenCheck size={22} className={signupInput.role === "instructor" ? "text-[#6366f1]" : "text-muted-foreground"} />
                      <span className={`text-xs sm:text-sm font-semibold ${signupInput.role === "instructor" ? "text-[#6366f1]" : "text-muted-foreground"}`}>Instructor</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground text-center leading-tight">Create & sell courses</span>
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")} className="w-full h-10 sm:h-11 rounded-xl gradient-bg text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  {
                    registerIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                      </>
                    ) : "Create Account"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card className="border-border/50 shadow-xl rounded-2xl mt-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Sign in to continue your learning journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="login-email" className="font-medium text-sm">Email</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      name="email"
                      value={loginInput.email}
                      placeholder="you@example.com"
                      onChange={(e) => changeInputHandler(e, "login")}
                      className="pl-10 h-10 sm:h-11 rounded-xl text-sm"
                      required={true} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password" className="font-medium text-sm">Password</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      name="password"
                      value={loginInput.password}
                      placeholder="Enter your password"
                      onChange={(e) => changeInputHandler(e, "login")}
                      className="pl-10 h-10 sm:h-11 rounded-xl text-sm"
                      required={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")} className="w-full h-10 sm:h-11 rounded-xl gradient-bg text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  {
                    loginIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                      </>
                    ) : "Sign In"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
export default Login