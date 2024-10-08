"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, CircleAlert, Fingerprint, Key } from "lucide-react";
import { useState } from "react";
import { loginUser } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export default function Home() {
    const [state, action] = useFormState(loginUser, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="p-4 w-full h-[calc(100vh-4rem)] max-md:h-[calc(100vh-10rem)] grid place-items-center">
            <Card className="w-[30rem] max-xs:w-[96%] p-8 max-xs:p-2">
                <CardHeader>
                    <CardTitle className="text-3xl max-xs:text-2xl">
                        Enter your credentials
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <div>
                            <div className="space-y-4">
                                <label
                                    className={cn("text-base font-semibold", {
                                        "text-red-500": state?.errors?.email,
                                    })}
                                    htmlFor="email"
                                >
                                    Student ID
                                </label>
                                <div className="w-full flex items-center focus-within:ring-1 focus-within:ring-ring border rounded p-1 px-4">
                                    <Fingerprint />
                                    <Input
                                        id="email"
                                        type="text"
                                        name="email"
                                        placeholder="Student ID"
                                        className="text-base border-none focus-visible:ring-0"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                {state?.errors?.email && (
                                    <p className="text-base font-semibold text-red-500">
                                        {state.errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="space-y-4">
                                <label
                                    htmlFor="password"
                                    className={cn("text-base font-semibold", {
                                        "text-red-500": state?.errors?.password,
                                    })}
                                >
                                    Password
                                </label>
                                <div className="w-full flex justify-between items-center focus-within:ring-1 focus-within:ring-ring border rounded p-1 px-4">
                                    <div className="flex items-center">
                                        <Key />
                                        <Input
                                            className="border-none focus-visible:ring-0 text-base"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    {showPassword ? (
                                        <EyeOff
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setShowPassword(false)
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setShowPassword(true)
                                            }
                                        />
                                    )}
                                </div>
                                {state?.errors?.password && (
                                    <p className="text-base font-semibold text-red-500">
                                        {state.errors.password}
                                    </p>
                                )}
                            </div>
                        </div>
                        <SubmitButton />
                        {state?.message && (
                            <div className="flex space-x-2">
                                <CircleAlert className="stroke-red-500" />
                                <p className="text-base font-semibold text-red-500">
                                    {state?.message}
                                </p>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} className="text-base" type="submit">
            Login
        </Button>
    );
}
