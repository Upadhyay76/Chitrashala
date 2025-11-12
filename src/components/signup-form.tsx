"use client";

import { useState } from "react";
import { authClient } from "~/server/better-auth/client";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import Link from "next/link";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [loading, setLoading] = useState(false);

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const form = e.target as HTMLFormElement;

		const name = (form.elements.namedItem("name") as HTMLInputElement).value;
		const email = (form.elements.namedItem("email") as HTMLInputElement).value;
		const password = (form.elements.namedItem("password") as HTMLInputElement)
			.value;
		const confirm = (
			form.elements.namedItem("confirm-password") as HTMLInputElement
		).value;

		if (password !== confirm) {
			setLoading(false);
			return alert("Passwords do not match");
		}

		const { data, error } = await authClient.signUp.email({
			name,
			email,
			password,
			image: "public/profile.svg",
			callbackURL: "/dashboard",
		});

		if (error) {
			setLoading(false);
			return alert(error.message);
		}

		console.log("Signup successful:", data);

		// 2️⃣ AUTO LOGIN RIGHT AFTER SIGNUP
		const login = await authClient.signIn.email({ email, password });

		if (login.error) {
			setLoading(false);
			// 3️⃣ REDIRECT USER
			window.location.href = "/login";
		} else {
			console.log("data", data);
		}

		// 3️⃣ REDIRECT USER
		window.location.href = "/home";

		setLoading(false);
	};
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>
						Enter your email below to create your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSignup}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
							</Field>

							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Input
											id="password"
											name="password"
											type="password"
											required
										/>
									</Field>

									<Field>
										<FieldLabel htmlFor="confirm-password">
											Confirm Password
										</FieldLabel>
										<Input
											id="confirm-password"
											name="confirm-password"
											type="password"
											required
										/>
									</Field>
								</Field>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>

							<Field>
								<Button type="submit" disabled={loading}>
									{loading ? "Creating..." : "Create Account"}
								</Button>
								<FieldDescription className="text-center">
									Already have an account? <Link href="/login">Sign in</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>

			{/* <FieldDescription className="px-6 text-center"> */}
			{/*   By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} */}
			{/*   and <a href="#">Privacy Policy</a>. */}
			{/* </FieldDescription> */}
		</div>
	);
}
