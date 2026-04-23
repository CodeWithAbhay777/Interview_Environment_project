import React, { useEffect, useState } from 'react'

import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'

import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice'

import { Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/api/auth/registerUser'

const Signup = () => {

    //mutation 
    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            if (data.success) {
                
                dispatch(setUser({ user: data.data, isAuthenticated: true }));
                
                toast.success("Account created successfully. Please verify your email." || data.message);
                registerMutation.loading = false;
                if (data.data.role === "candidate") {
                    navigate("/candidate-profile-form");
                }else {
                    navigate("/recruiter-profile-form");
                }
                
            }
        },
        onError: (error) => {
            console.log("Error while registrationnn : ",error);
            toast.error(error || "Something went wrong");
            registerMutation.loading = false;
        }
    })

    const [input, setInput] = useState({
        
        email: "",
        username: "",
        password: "",
        role: "",
        
    });
    const [loading , setLoading] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

   
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();   
        setLoading(true);
        if (!input.email || !input.username || !input.password || !input.role) {
            toast.error("Please fill all the fields");
            setLoading(false);
            return;
        }
        if (input.password && input.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }
        if (input.role !== "candidate" && input.role !== "recruiter") {
            toast.error("Please select a valid role")
            return;
        }
        formData.append("email", input.email);
        formData.append("username", input.username);
        formData.append("password", input.password);
        formData.append("role", input.role);

        registerMutation.mutate(input);

        

    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-6 sm:py-10'>
            <form onSubmit={submitHandler} className='w-full sm:w-1/2 md:w-1/2 lg:w-1/3 border border-gray-200 rounded-md p-6 sm:p-8 max-w-md'>
                <h1 className='font-bold text-2xl sm:text-3xl mb-6'>Sign Up</h1>
                
                <div className='my-4'>
                    <Label className='block mb-2'>Username</Label>
                    <Input
                        type="text"
                        value={input.username}
                        name="username"
                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                        placeholder="Enter username"
                        className='w-full'
                    />
                </div>

                <div className='my-4'>
                    <Label className='block mb-2'>Email</Label>
                    <Input
                        type="email"
                        value={input.email}
                        name="email"
                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                        placeholder="abc@gmail.com"
                        className='w-full'
                    />
                </div>
                
                <div className='my-4'>
                    <Label className='block mb-2'>Password</Label>
                    <Input
                        type="password"
                        value={input.password}
                        name="password"
                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                        placeholder="atleast 8 characters"
                        className='w-full'
                    />
                </div>
                <div className='my-4'>
                    <Label className='block mb-3 text-sm'>Select Role</Label>
                    <RadioGroup className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="candidate"
                                checked={input.role === 'candidate'}
                                onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                className="cursor-pointer w-4 h-4"
                                id="candidate-signup"
                            />
                            <Label htmlFor="candidate-signup" className="cursor-pointer text-sm font-normal">Candidate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="recruiter"
                                checked={input.role === 'recruiter'}
                                onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                className="cursor-pointer w-4 h-4"
                                id="recruiter-signup"
                            />
                            <Label htmlFor="recruiter-signup" className="cursor-pointer text-sm font-normal">Recruiter</Label>
                        </div>
                    </RadioGroup>
                </div>
                {
                    registerMutation.loading ? <Button className="w-full my-6 bg-[#5b30a6] text-base py-2"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-6 bg-[#5b30a6] text-base py-2">Signup</Button>
                }
                <span className='text-sm text-gray-600'>Already have an account? <Link to="/login" className='text-blue-600 font-medium hover:underline'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup