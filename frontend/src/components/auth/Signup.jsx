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
            console.log("Error while registration : ",error);
            toast.error(error.message || "Something went wrong");
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
        <div className='flex items-center justify-center  w-full'>
            
            <div className='flex items-center justify-center w-full sm:max-w-7xl  mx-auto p-2'>
                <form onSubmit={submitHandler} className='w-full sm:w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    

                    <div className='my-2'>
                        <Label>Username</Label>
                        <Input
                            type="text"
                            value={input.username}
                            name="username"
                            onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                            placeholder="Enter username"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                            placeholder="abc@gmail.com"
                        />
                    </div>
                    
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                            placeholder="atleast 8 characters"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-3">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={input.role === 'candidate'}
                                    onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Candidate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>

                        </RadioGroup>
                       
                    </div>
                    {
                        registerMutation.loading ? <Button className="w-full my-4 bg-[#5b30a6]"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-[#5b30a6]">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
            
        </div>
    )
}

export default Signup