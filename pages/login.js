/** @format */

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const LoginUser = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/",
    });
    console.log(res);
    if (res?.error) {
      console.log(res);
    }
    router.push("/");
  };
  return (
    <div className="bg-[url('/bg.png')] w-[100%] h-[100vh] bg-no-repeat bg-cover flex justify-center items-center">
      <div className="w-full h-screen font-sans bg-cover bg-landscape">
        <div className="container flex items-center justify-center flex-1 h-full mx-auto">
          <div className="w-full max-w-lg">
            <div className="leading-loose">
              <form className="max-w-sm p-10 m-auto bg-white bg-opacity-25 rounded shadow-xl">
                <p className="mb-8 text-2xl font-light text-center text-white">
                  Login
                </p>
                <div className="mb-2">
                  <div className=" relative ">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className=" relative ">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={(e) => {
                      LoginUser(e);
                    }}
                    type="submit"
                    className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Validate
                  </button>
                </div>
                <div className="text-center">
                  <Link href={"/signup"}>
                    <a className="right-0 inline-block text-sm font-light align-baseline text-500 hover:text-gray-800">
                      Create an account
                    </a>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
