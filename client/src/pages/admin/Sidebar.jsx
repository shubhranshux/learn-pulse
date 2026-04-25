import { Link, Outlet, useLocation } from 'react-router-dom'
import React from 'react'
import { ChartNoAxesColumn, SquareLibrary, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'

function Sidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname.includes(path);
    const [open, setOpen] = useState(false);

    const navLinks = [
        { path: "dashboard", label: "Dashboard", icon: ChartNoAxesColumn },
        { path: "course", label: "Courses", icon: SquareLibrary },
    ];

    const NavContent = ({ onNavigate }) => (
        <>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3'>Admin Panel</p>
            {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                    key={path}
                    to={path}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(path)
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                    <Icon size={18} />
                    <span>{label}</span>
                </Link>
            ))}
        </>
    );

    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Mobile top bar with menu toggle */}
            <div className='lg:hidden flex items-center gap-3 p-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-14 sm:top-16 z-30'>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                            <Menu size={18} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[260px] glass pt-8">
                        <SheetHeader>
                            <SheetTitle className="text-left gradient-text font-bold">Admin Panel</SheetTitle>
                        </SheetHeader>
                        <div className='mt-6 space-y-2'>
                            <NavContent onNavigate={() => setOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
                <span className='text-sm font-semibold text-muted-foreground'>
                    {navLinks.find(l => isActive(l.path))?.label || 'Admin'}
                </span>
            </div>

            {/* Desktop sidebar */}
            <div className='hidden lg:block w-[260px] space-y-2 border-r border-border/50 p-6 sticky top-16 h-[calc(100vh-4rem)] bg-card/50'>
                <NavContent />
            </div>

            {/* Main content */}
            <div className='flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl'>
                <Outlet />
            </div>
        </div>
    )
}

export default Sidebar
