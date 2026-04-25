import React, { useEffect, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, Mail, User, Shield } from 'lucide-react';
import Course from './Course';
import { useLoadUserQuery, useUpdateUserMutation } from '../../features/api/authApi';
import { toast } from "sonner";


function Profile() {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    const { data, isLoading, refetch } = useLoadUserQuery();
    const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    }

    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);
    };

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(updateUserData?.message || "Profile updated.");
        }
        if (isError) {
            toast.error(error?.data?.message || "Failed to update profile.");
        }
    }, [error, updateUserData, isSuccess, isError])

    if (isLoading) return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
    );
    const user = data && data.user;

    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 my-8 sm:my-12'>
            <div className='mb-6 sm:mb-8'>
                <h1 className='font-extrabold text-2xl sm:text-3xl tracking-tight'>My Profile</h1>
                <p className='text-muted-foreground mt-1 text-sm sm:text-base'>Manage your account settings and preferences</p>
            </div>

            <div className='bg-card border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-sm'>
                <div className='flex flex-col items-center sm:flex-row sm:items-start gap-6 sm:gap-8'>
                    <div className='flex flex-col items-center'>
                        <div className='relative group'>
                            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 ring-4 ring-primary/10 shadow-xl">
                                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl sm:text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300'>
                                <Camera className='text-white' size={22} />
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 space-y-3 sm:space-y-4 w-full'>
                        <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/50'>
                            <User size={16} className='text-muted-foreground flex-shrink-0' />
                            <div className='min-w-0'>
                                <p className='text-[10px] sm:text-xs text-muted-foreground font-medium'>Full Name</p>
                                <p className='font-semibold text-sm sm:text-base truncate'>{user.name}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/50'>
                            <Mail size={16} className='text-muted-foreground flex-shrink-0' />
                            <div className='min-w-0'>
                                <p className='text-[10px] sm:text-xs text-muted-foreground font-medium'>Email</p>
                                <p className='font-semibold text-sm sm:text-base truncate'>{user.email}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/50'>
                            <Shield size={16} className='text-muted-foreground flex-shrink-0' />
                            <div>
                                <p className='text-[10px] sm:text-xs text-muted-foreground font-medium'>Role</p>
                                <p className='font-semibold capitalize text-sm sm:text-base'>{user.role}</p>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-2 gradient-bg text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl mx-4 sm:mx-0 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-lg sm:text-xl font-bold">Edit Profile</DialogTitle>
                                    <DialogDescription className="text-xs sm:text-sm">
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 sm:gap-5 py-4'>
                                    <div className='grid gap-2'>
                                        <Label className="font-medium text-sm">Name</Label>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="h-10 sm:h-11 rounded-xl text-sm" />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label className="font-medium text-sm">Profile Photo</Label>
                                        <Input onChange={onChangeHandler} type="file" accept="image/*" className="rounded-xl text-sm" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button disabled={updateUserIsLoading} onClick={updateUserHandler} className="gradient-bg text-white border-0 rounded-xl shadow-lg w-full sm:w-auto text-sm">
                                        {
                                            updateUserIsLoading ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...
                                                </>
                                            ) : "Save Changes"
                                        }
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className='mt-8 sm:mt-12'>
                <h2 className='font-bold text-lg sm:text-xl mb-1'>Enrolled Courses</h2>
                <p className='text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6'>Courses you are currently learning</p>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6'>
                    {
                        user.enrolledCourses.length === 0 ? (
                            <div className='col-span-full text-center py-10 sm:py-12 bg-muted/30 rounded-xl sm:rounded-2xl border border-border/50'>
                                <p className='text-muted-foreground text-sm'>You haven't enrolled in any course yet</p>
                                <Button variant="link" className="mt-2 text-primary text-sm" onClick={() => window.location.href = '/'}>Browse Courses</Button>
                            </div>
                        ) : (
                            user.enrolledCourses.map((course) => <Course course={course} key={course._id} />)
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile
