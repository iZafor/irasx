import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { login } from "./lib/apis";
import { AuthResponse, StoredAuthData } from "./lib/definition";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [showInvalid, setShowInvalid] = useState(false);

    async function handleLogin(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        try {
            const formData = new FormData(ev.currentTarget);
            const res: AuthResponse = await login(
                {
                    email: formData.get("uid")?.toString() || "",
                    password: formData.get("password")?.toString() || ""
                })
                .then(res => res.json());
            if (res.message !== "Success") {
                setShowInvalid(true);
                return;
            }
            const data: StoredAuthData = {
                id: formData.get("uid")?.toString() || "",
                data: res
            };
            localStorage.setItem("authData", JSON.stringify(data));
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-60 w-full grid place-items-center">
            <Card className="p-10">
                <CardTitle className="text-3xl">Enter your credentials</CardTitle>
                <CardContent className="p-0 mt-4">
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <Input className="text-base" name="uid" placeholder="ID" required />
                        <Input className="text-base" type="password" name="password" placeholder="Password" required />
                        <Button className="text-base" type="submit">Login</Button>
                        {showInvalid &&
                            <p className="text-red-500">Invalid credentials!</p>
                        }
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}