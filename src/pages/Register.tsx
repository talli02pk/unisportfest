import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  rollNumber: z.string().min(3, { message: "Roll number must be at least 3 characters" }),
  department: z.string().min(1, { message: "Please select a department" }),
  section: z.string().min(1, { message: "Section is required" }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select your gender" }),
  games: z.array(z.string()).min(1, { message: "Select at least one game" }),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" })
});

type FormData = z.infer<typeof formSchema>;

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Business Administration",
  "Economics",
  "Physics",
  "Mathematics",
  "Chemistry",
  "Biology"
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      rollNumber: "",
      department: "",
      section: "",
      gender: undefined,
      games: [],
      agreeToTerms: false
    }
  });

  const handleGameToggle = (game: string) => {
    setSelectedGames(prevGames => {
      if (prevGames.includes(game)) {
        return prevGames.filter(g => g !== game);
      } else {
        return [...prevGames, game];
      }
    });
    
    // Update form value
    const currentGames = form.getValues("games");
    if (currentGames.includes(game)) {
      form.setValue("games", currentGames.filter(g => g !== game), { shouldValidate: true });
    } else {
      form.setValue("games", [...currentGames, game], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      console.log("Form submitted with data:", data);
      
      // Send data to SQL Server via our API
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }
      
      toast({
        title: "Registration Successful!",
        description: `Thank you, ${data.fullName}! Your registration for the Sports Fest has been received.`,
        duration: 5000,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Could not connect to the server. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for registering for the University Sports Fest 2025. We've sent a confirmation to your university email.</p>
            <Button 
              asChild
              className="bg-sports-blue hover:bg-sports-blue/90"
            >
              <a href="/">Return to Homepage</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-sports-blue p-6 text-white">
              <h1 className="font-montserrat text-2xl md:text-3xl font-bold">Sports Fest Registration</h1>
              <p className="text-white/80 mt-1">Join the competition and represent your department!</p>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...form.register("fullName")}
                    className="border-gray-300"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
                
                {/* Roll Number */}
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    placeholder="Enter your roll number"
                    {...form.register("rollNumber")}
                    className="border-gray-300"
                  />
                  {form.formState.errors.rollNumber && (
                    <p className="text-sm text-red-500">{form.formState.errors.rollNumber.message}</p>
                  )}
                </div>
                
                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    onValueChange={value => form.setValue("department", value, { shouldValidate: true })}
                    defaultValue={form.getValues("department")}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.department && (
                    <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
                  )}
                </div>
                
                {/* Section */}
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    placeholder="Enter your section"
                    {...form.register("section")}
                    className="border-gray-300"
                  />
                  {form.formState.errors.section && (
                    <p className="text-sm text-red-500">{form.formState.errors.section.message}</p>
                  )}
                </div>
              </div>
              
              {/* Gender */}
              <div className="space-y-3">
                <Label>Gender</Label>
                <RadioGroup 
                  onValueChange={value => form.setValue("gender", value as "male" | "female" | "other", { shouldValidate: true })}
                  defaultValue={form.getValues("gender")}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
              </div>
              
              {/* Games */}
              <div className="space-y-3">
                <Label>Games (Select at least one)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["Cricket", "Football", "Badminton", "Table Tennis", "Athletics"].map(game => (
                    <div key={game} className="flex items-center space-x-2">
                      <Checkbox 
                        id={game} 
                        checked={selectedGames.includes(game)} 
                        onCheckedChange={() => handleGameToggle(game)}
                      />
                      <Label htmlFor={game} className="cursor-pointer">{game}</Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.games && (
                  <p className="text-sm text-red-500">{form.formState.errors.games.message}</p>
                )}
              </div>
              
              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="agreeToTerms" 
                  checked={form.getValues("agreeToTerms")}
                  onCheckedChange={checked => 
                    form.setValue("agreeToTerms", checked === true, { shouldValidate: true })
                  }
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the event rules and confirm that I am fit to participate in the sports events. I understand that the university is not liable for any injuries sustained during the event.
                </Label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-500">{form.formState.errors.agreeToTerms.message}</p>
              )}
              
              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-sports-blue hover:bg-sports-blue/90 font-semibold text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
