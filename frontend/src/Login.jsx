import { useEffect, useState } from 'react';
import logo from "./assets/ChatGPT Image Feb 8, 2026, 02_54_59 AM.png"
import { faCircleCheck, faCircleExclamation, faCircleNotch, faEye, faEyeSlash, faSpinner, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [serverLoader, setServerLoader] = useState(true)
  const [serverText, setServerText] = useState("")
  const [serverState, setServerState] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false)
  const [loginLoader, setLoginLoader] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate()


  useEffect(() => {
    const checkServer = async () => {
      setServerLoader(true)
      setServerText("Waking up TrackIt Servers ...")
      setServerState("loading")

      try {
        const res = await fetch("https://trackit-xisc.onrender.com")

        if (!res.ok) {
          throw new Error("Server not reachable")
        }

        const data = await res.text()
      } catch (error) {
        console.error(error)
        setServerText("Unable to reach TrackIt server. Please try again.")
        setServerState("error")
      } finally {
        setServerText("TrackIt servers are ready.")
        setServerState("success")
        setTimeout(() => {
          setServerLoader(false)
        }, 3000);
      }
    }

    checkServer()
  }, [])



  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {

      const loginApi = async () => {

        try {

          setLoginError(false);
          setErrorMessage("")
          setLoginLoader(true)

          const rawData = await fetch("https://trackit-xisc.onrender.com/api/user/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          })

          const data = await rawData.json();

          if (!rawData.ok) {
            throw new Error(data.msg);
          }

          navigate("/dashboard", { state: { fromLogin: true } });
          setLoginLoader(false)
        }
        catch (err) {
          setLoginError(true);
          setErrorMessage(err.message)
          setLoginLoader(false)
        }

      }

      loginApi();

    } else {

      const registerApi = async () => {

        try {

          setLoginError(false);
          setErrorMessage("")
          setLoginLoader(true)

          if(formData.password !== formData.confirmPassword){
            throw new Error("Password does not match");
            
          }

          const rawData = await fetch("https://trackit-xisc.onrender.com/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          })

          const data = await rawData.json();

          if (!rawData.ok) {
            throw new Error(data.msg);
          }

          setLoginLoader(false)
          toggleForm()
        }
        catch (err) {
          setLoginError(true);
          setErrorMessage(err.message)
          setLoginLoader(false)
        }
      }

      registerApi()

    }
  };

  const handleChange = (e) => {
    setErrorMessage("")
    setLoginError(false)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    setErrorMessage("")
    setLoginError(false)
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <>

      <div
        className={`fixed top-12 left-1/12 bg-white px-10 py-3 rounded-lg shadow-lg border border-blue-300 flex items-center gap-2
        transition-all duration-500
        ${serverLoader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        {
          serverState === "loading" ? (
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />
          ) : serverState === "success" ? (
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-400" />
          ) : (
            <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500" />
          )
        }

        <p className="font-medium">{serverText}</p>
      </div>

      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          <div className="flex flex-col justify-center items-center mb-8">
            <img src={logo} className='w-48' />
            <h1 className="text-4xl font-bold text-blue-900">TrackIt</h1>
            <p className="text-blue-600 mt-2">Track your expenses with ease</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                  </div>
                  <input
                    type="text"
                    id="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. example123"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-md"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 "
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {loginError && (
                <div className="text-red-500 flex flex-row items-center pl-4">
                  <FontAwesomeIcon icon={faXmarkCircle} />
                  <p className="text-sm pl-2">{errorMessage}</p>
                </div>

              )

              }

              {isLogin && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                {
                  loginLoader && (
                    <>
                    <FontAwesomeIcon icon={faCircleNotch} spin className='mr-1.5' />
                    </>
                  )
                }
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">

              </div>
            </div>



            <div className="mt-6 text-center">
              <p className="text-blue-900">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-blue-600 font-semibold hover:text-blue-800"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
