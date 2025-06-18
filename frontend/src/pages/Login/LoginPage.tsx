import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import { usePostData } from "@/hooks/useMutateData";
import {ENDPOINTS} from "@/constants/apiUrl.ts";

// Updated Zod schema
const loginSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, { // Added password field
        message: "Password must be at least 6 characters.",
    }),
    remember: z.boolean().default(false).optional(), // Added remember me field
});

const LoginPage = () => {
    const navigate = useNavigate();
    const {
        AUTHENTICATION: {
            LOGIN
        }
    } = ENDPOINTS;

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            remember: false,
        },
    });

// Use your custom usePostData hook
    const { mutate: loginMutate } = usePostData(
        ["login"], // A unique key for this mutation
        LOGIN, // The login API endpoint
        {
            options:  {
                onSuccess: () => {
                    toast("Login successfully!", {
                        position: "top-center",
                    });
                    navigate("/");
                },
                onError: (error) => {
                    const errorMessage =
                        error?.message ||
                        "Login failed! Please check your credentials.";

                    toast(errorMessage, {
                        position: "top-center",
                    });
                },
            },
        },
        ['authStatus']
    );

    function onSubmit(values: z.infer<typeof loginSchema>) {
        // Transform the form values to the desired output format
        const submissionData = {
            identifier: values.username,
            password: values.password,
            remember: values.remember || false,
        };

        loginMutate(submissionData)
        console.log("Formatted Submission Data:", submissionData);
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Login
                </h2>
                <Form {...loginForm}>
                    <form
                        onSubmit={loginForm.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your_username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={loginForm.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Remember me</FormLabel>
                                        <FormDescription>
                                            Keep me logged in on this device.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
