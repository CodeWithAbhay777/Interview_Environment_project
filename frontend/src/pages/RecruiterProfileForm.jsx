import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Linkedin, LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useResendTimer from "@/hooks/useResendTimer";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendOtp } from "@/api/emailVerification/sendOtp";
import { verifyEmail } from "@/api/emailVerification/verifyEmail";
import { toast } from "sonner";
import { setUser , setIsEmailVerification} from "@/redux/authSlice";
import { submitUserProfile } from "@/api/recruiterProfile/submitUserProfile";
import { setProfile } from "@/redux/userProfileSlice";
import { useToastOnError } from "@/hooks/useToastOnError";
import { validatePhoneNumber } from "@/utils/phoneValidation";

const RecruiterProfileForm = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const {userProfile} = useSelector(store => store.profile);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(
    user?.isEmailVerified || false
  );

  const { timeLeft, isResendDisabled, handleResend } = useResendTimer();

  const [formData, setFormData] = useState({
    user_id : user?._id,
    fullname: "",
    phone: "",
    address: "",
    profilePhoto: null,
    designation: "",
    expertiseAreas: [],
    totalExperience: null,
    linkedinProfile: "",
    bio: "",
    preferredInterviewType: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API CALLS
  const {
    data: sendOtpData,
    isFetching: sendOtpIsFetching,
    isError: sendOtpIsError,
    refetch: sendOtpRefetch,
  } = useQuery({
    queryKey: ["otp"],
    queryFn: () => sendOtp(user?.email),
    enabled: false,
  });

  const submitVerificationCodeMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      if (data) {
        toast.success(data || "Email verified successfully");
      }

      setIsEmailVerified(true);
      setShowOtpInput(false);
      dispatch(setIsEmailVerification({isEmailVerified : true}));
    },

    onError: (error) => {
      console.log("Erro while verifying otp : ", error);
      toast.error(error.message || "Verifying OTP : Something went wrong");
    },
  });

  const submitRecruiterProfileFormMutation = useMutation({
    mutationFn: submitUserProfile,
    onSuccess: (data) => {
      console.log("DATA : ", data.data);
      dispatch(setUser({user : data.data.newUpdatedUser}));
      dispatch(setProfile({profile : data.data.createdProfile}));
      toast.success(data.message || "Recruiter profile created successfully");
      
      navigate("/");
    },
    onError: (error) => {
      console.log("Error while submitting profile : ", error);
      toast.error(error.message || "Profile submit : Something went wrong!");
    },
  });

  useToastOnError(sendOtpIsError, "Sending OTP failed. Please try again.");

  useEffect(() => {
      if (sendOtpData) {
        toast.success(sendOtpData);
      }
    }, [sendOtpData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (!isEmailVerified) {
          toast.info("Recommandation : Verify your email before submit");
          return;
    }

    if (!validatePhoneNumber(formData.phone).isValid) {
          toast.error(validatePhoneNumber.message || "Phone number is not valid");
          return;
    }

    if (!formData.fullname || !formData.address || !formData.designation || formData.expertiseAreas.length < 1) {
          toast.error("Enter all required fields");
          return;
    }

    if (formData.totalExperience) {
      formData.totalExperience = Number(formData.totalExperience);
    }

    submitRecruiterProfileFormMutation.mutate(formData);
  };

  // Handle expertise areas
  const handleExpertiseInput = (e) => {
    if (e.key === "Enter" && expertiseInput.trim()) {
      e.preventDefault();
      if (!formData.expertiseAreas.includes(expertiseInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          expertiseAreas: [...prev.expertiseAreas, expertiseInput.trim()],
        }));
      }
      setExpertiseInput("");
    }
  };

  //first time otp sending function
  const handleVerifyEmail = () => {
    if (!user?.email) {
      toast.error("No email found for verification.");
      return;
    }
    console.log("Sending OTP to:", user?.email);
    sendOtpRefetch();
    setShowOtpInput(true);
  };

  // submit otp function
  const handleResendOtp = () => {
    if (!user?.email) {
      toast.error("No email found for verification.");
      return;
    }

    sendOtpRefetch();
    handleResend(120);
  };

  const handleSubmitOtp = () => {
    if (!otp || otp.length !== 6) return;
        console.log("Submitting OTP:", otp);
        if (!user?.email || !user?._id) {
          toast.error("No email found for verification.");
          return;
        }
    
        submitVerificationCodeMutation.mutate({
          email: user?.email,
          id: user?._id,
          code: otp,
        });
        setOtp("");

  };

  useEffect(() => {
    if (showOtpInput) {
      const otpInputs = document.querySelectorAll("#otp-input");
      otpInputs[0]?.focus();
    }
  }, [showOtpInput]);

  return (
    <div className="min-h-screen w-full p-2 sm:p-6 bg-gray-100">
      <Card className="w-full sm:max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Recruiter Profile Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Enter your full name"
                value={user?.fullname}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Profile photo and Designation */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Photo */}
            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.files[0],
                  }))
                }
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#6A38C2] file:text-primary-foreground hover:file:bg-[#5b30a6]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredInterviewType">
                Preferred Interview Type
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferredInterviewType: value,
                  }))
                }
                value={formData.preferredInterviewType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                  <SelectItem value="fullstack">
                    Full Stack Development
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              placeholder="Enter your designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Experience and LinkedIn */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="totalExperience">Total Experience (years)</Label>
              <Input
                id="totalExperience"
                name="totalExperience"
                type="number"
                min="0"
                step="0.5"
                placeholder="Years of experience"
                value={formData.totalExperience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                
              />
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-2">
              <Label htmlFor="linkedinProfile">LinkedIn Profile URL</Label>
              <div className="relative">
                <Input
                  id="linkedinProfile"
                  name="linkedinProfile"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedinProfile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="pl-10"
                  
                />
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6A38C2]" />
              </div>
            </div>
          </div>

          {/* Expertise Areas */}
          <div className="space-y-2">
            <Label htmlFor="expertiseAreas">
              Expertise Areas (Press Enter to add)
            </Label>
            <Input
              id="expertiseAreas"
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              onKeyDown={handleExpertiseInput}
              placeholder="Type an expertise area and press Enter"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.expertiseAreas.map((expertise, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {expertise}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        expertiseAreas: prev.expertiseAreas.filter(
                          (e) => e !== expertise
                        ),
                      }))
                    }
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferred Interview Type */}

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself and your interviewing experience"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Email Verification */}

          <div className="space-y-4">
            <div className="space-y-2  ">
              <Label>Email Verification</Label>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 px-4 py-2 bg-gray-50 rounded-md border">
                  {user?.email ? (
                    <span className="text-gray-800 font-semibold">
                      {user?.email}
                    </span>
                  ) : (
                    <span className="text-gray-800 font-semibold">
                      No email found
                    </span>
                  )}
                  
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={isEmailVerified || showOtpInput || sendOtpIsFetching}
                  className={`whitespace-nowrap ${
                    isEmailVerified
                      ? "bg-green-500 text-white"
                      : "bg-[#6A38C2] text-white hover:bg-[#5b30a6]"
                  } `}
                >
                  {isEmailVerified ? "Email Verified ✓" : "Verify Email"}
                </Button>
              </div>
            </div>

            {/* OTP Input */}
            {showOtpInput && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex gap-2 justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      onChange={setOtp}
                      value={otp}
                      id="otp-input"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={handleSubmitOtp}
                    className="px-8 bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
                  >
                    Submit OTP
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResendOtp}
                    variant="outline"
                    disabled={isResendDisabled}
                    className={`px-8 ${
                      isResendDisabled ? "cursor-not-allowed" : ""
                    } bg-white text-[#6A38C2] hover:bg-gray-100`}
                  >
                    {isResendDisabled
                      ? `Resend OTP (${timeLeft}s)`
                      : `Resend OTP`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitRecruiterProfileFormMutation.isPending}
            className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
          >
            {!submitRecruiterProfileFormMutation.isPending ? (
              "Submit Profile"
            ) : (
              <LoaderCircle className="h-4 w-4 animate-spin infinite" />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterProfileForm;
