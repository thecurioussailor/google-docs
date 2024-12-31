import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        console.log("")
        const response = await axios.post('http://localhost:3000/signup', {
            username,
            password
        })
        localStorage.setItem('token', response.data.token);
        navigate('/documents')
    }
  return (
    <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[calc(100vh-80px)] lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                        Create an account
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="username" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required/>
                        </div>
                        <button onClick={handleSignup} type="submit" className="w-full text-white bg-gray-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign Up</button>
                        <p className="text-sm font-light text-gray-500">
                            Already have an account yet? <Link to={'/signin'} className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
)
}

export default Signup