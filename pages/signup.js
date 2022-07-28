/** @format */
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [pic, setPic] = useState("");

  const postDetails = (pic) => {
    if (!pic) {
      toast.error("Please select a profile picture");
    }

    if (pic.type === "image/jpeg" || "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "hellooworkd");
      fetch("https://api.cloudinary.com/v1_1/hellooworkd/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLoading(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = toast.loading("Please wait...");
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        pic,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const respData = await response.json();
    const { success, msg } = respData;
    console.log(respData);
    if (success) {
      toast.update(id, {
        render: msg,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    }
    if (!success) {
      toast.update(id, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="bg-[url('/bg.png')] w-[100%] h-[100vh] bg-no-repeat bg-cover flex justify-center items-center">
      <div className="w-full h-screen font-sans bg-cover bg-landscape">
        <div className="container flex items-center justify-center flex-1 h-full mx-auto">
          <div className="w-full max-w-lg">
            <div className="leading-loose">
              <form
                className="max-w-sm p-10 m-auto bg-white bg-opacity-25 rounded shadow-xl"
                onSubmit={handleSubmit}
              >
                <p className="mb-8 text-2xl font-light text-center text-white">
                  Create an Account
                </p>
                <div className="mb-2">
                  <div className=" relative ">
                    <input
                      type="text"
                      name="name"
                      className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="relative ">
                    <label htmlFor="email">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </label>
                  </div>
                </div>
                <div className="mb-2">
                  <div className=" relative ">
                    <input
                      type="text"
                      name="password"
                      className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className=" relative ">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      htmlFor="file_input"
                    ></label>
                    <input
                      className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent file:bg-white file:rounded-2xl file:text-sm file:px-2  file:cursor-pointer  file:border file:border-gray-300 file:text-gray-400 "
                      aria-describedby="file_input_help"
                      id="file_input"
                      type="file"
                      title="Choose a video please"
                      name="pic"
                      onChange={(e) => postDetails(e.target.files[0])}
                    />
                    <p
                      className="mt-1 text-sm text-white dark:text-white"
                      id="file_input_help"
                    >
                      Upload a profile picture
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="submit"
                    className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Generate Account
                  </button>
                  <ToastContainer />
                </div>
                <div className="text-center">
                  <Link href="/login">
                    <a className="right-0 inline-block text-sm font-light align-baseline text-500 hover:text-gray-800">
                      Already have an account?
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

export default Signup;
