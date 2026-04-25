import React, { useState } from 'react'
import Logo from './Logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import DarkMode from '../DarkMode'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '../features/api/authApi'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { ChartNoAxesColumn, BookOpen, UserCircle, LogOut, Home } from 'lucide-react'

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out.")
      navigate("/login")
    }
  }, [isSuccess])

  return (
    <div className='h-14 sm:h-16 glass border-b border-border/50 fixed top-0 left-0 right-0 z-50 transition-all duration-300'>
      <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-6'>
        <Link to="/" className='flex items-center gap-2.5 group'>
          <div className='h-9 w-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
            <Logo size={22} />
          </div>
          <h1 className='font-extrabold text-xl tracking-tight'>
            <span className='gradient-text'>LearnPulse</span>
          </h1>
        </Link>

        {/* Desktop nav links */}
        <div className='flex items-center gap-1'>
          {user && (
            <>
              <Link to="/my-learning">
                <Button variant="ghost" size="sm" className="font-medium text-sm text-muted-foreground hover:text-foreground">
                  <BookOpen size={15} className="mr-1.5" />
                  My Learning
                </Button>
              </Link>
              {user?.role === "instructor" && (
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="font-medium text-sm text-muted-foreground hover:text-foreground">
                    <ChartNoAxesColumn size={15} className="mr-1.5" />
                    Dashboard
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* User icon and darkmode icon */}
        <div className='flex items-center gap-3'>
          {
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300 cursor-pointer focus:outline-none">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[100] bg-card border-border shadow-xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="my-learning">
                        <BookOpen size={14} className="mr-2" />
                        My Learning
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="profile">
                        <UserCircle size={14} className="mr-2" />
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "instructor" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="admin/dashboard">
                            <ChartNoAxesColumn size={14} className="mr-2" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut size={14} className="mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center gap-2 sm:gap-3'>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="font-medium text-sm">Login</Button>
                <Button size="sm" onClick={() => navigate("/login")} className="gradient-bg text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm">Get Started</Button>
              </div>
            )
          }
          <DarkMode />
        </div>
      </div>

      {/* Mobile Device */}
      <div className='flex md:hidden items-center justify-between px-4 h-full'>
        <Link to="/" className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-lg gradient-bg flex items-center justify-center'>
            <Logo size={18} />
          </div>
          <h1 className='font-extrabold text-lg gradient-text'>LearnPulse</h1>
        </Link>
        <div className='flex items-center gap-2'>
          <DarkMode />
          <MobileNavbar user={user} logoutHandler={logoutHandler} />
        </div>
      </div>
    </div>
  )
}

export default Navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logoutHandler();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='icon' className="rounded-full h-9 w-9" variant="outline">
          <FaBars size={14} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col glass w-[280px] sm:w-[320px]">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <span className='gradient-text font-extrabold text-lg'>LearnPulse</span>
          </SheetTitle>
        </SheetHeader>

        {user ? (
          <>
            {/* User info */}
            <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/50 mt-4'>
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='min-w-0'>
                <p className='font-semibold text-sm truncate'>{user?.name}</p>
                <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
              </div>
            </div>

            <nav className='flex flex-col space-y-1 mt-4'>
              <button 
                onClick={() => handleNavigate('/')} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors text-left"
              >
                <Home size={16} className='text-muted-foreground' />
                Home
              </button>
              <button 
                onClick={() => handleNavigate('/my-learning')} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors text-left"
              >
                <BookOpen size={16} className='text-muted-foreground' />
                My Learning
              </button>
              <button 
                onClick={() => handleNavigate('/profile')} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors text-left"
              >
                <UserCircle size={16} className='text-muted-foreground' />
                Edit Profile
              </button>
              {user?.role === "instructor" && (
                <button 
                  onClick={() => handleNavigate('/admin/dashboard')} 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors text-left"
                >
                  <ChartNoAxesColumn size={16} className='text-muted-foreground' />
                  Dashboard
                </button>
              )}
            </nav>

            <div className='mt-auto space-y-2 pb-2'>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-3 mt-6'>
            <Button onClick={() => handleNavigate('/login')} className="gradient-bg text-white border-0 w-full rounded-xl shadow-lg font-semibold">
              Get Started
            </Button>
            <Button variant="outline" onClick={() => handleNavigate('/login')} className="w-full rounded-xl font-medium">
              Login
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}