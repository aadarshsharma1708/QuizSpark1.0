// import { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { useForm } from 'react-hook-form'
// import { toast } from 'react-hot-toast'
// import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
// import { login, reset } from '../../store/slices/authSlice'

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)
  
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
  
//   const { user, isLoading, isError, isSuccess, message } = useSelector(
//     (state) => state.auth
//   )

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm()

//   useEffect(() => {
//     if (isError) {
//       toast.error(message)
//     }

//     if (isSuccess || user) {
//       navigate('/dashboard')
//     }

//     dispatch(reset())
//   }, [user, isError, isSuccess, message, navigate, dispatch])

//   const onSubmit = (data) => {
//     dispatch(login(data))
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-xl">Q</span>
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//             Welcome back
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
//             Sign in to your QuizSpark account
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-4">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   {...register('email', {
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: 'Invalid email address'
//                     }
//                   })}
//                   type="email"
//                   className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   {...register('password', {
//                     required: 'Password is required'
//                   })}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
//                 Remember me
//               </label>
//             </div>

//             <div className="text-sm">
//               <Link
//                 to="/auth/forgot-password"
//                 className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
//               >
//                 Forgot your password?
//               </Link>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//             >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <div className="spinner w-4 h-4 mr-2"></div>
//                   Signing in...
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <LogIn className="h-4 w-4 mr-2" />
//                   Sign in
//                 </div>
//               )}
//             </button>
//           </div>

//           {/* Sign Up Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Don't have an account?{' '}
//               <Link
//                 to="/auth/register"
//                 className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
//               >
//                 Sign up for free
//               </Link>
//             </p>
//           </div>
//         </form>

//         {/* Demo Credentials */}
//         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//           <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
//             Demo Credentials
//           </h3>
//           <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
//             <p><strong>User:</strong> user@demo.com / password123</p>
//             <p><strong>Admin:</strong> admin@demo.com / admin123</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, LogIn, User, Shield } from 'lucide-react'
import { login, reset } from '../../store/slices/authSlice'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onSubmit = (data) => {
    dispatch(login(data))
  }

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setValue('email', 'admin@demo.com')
      setValue('password', 'admin123')
    } else {
      setValue('email', 'user@demo.com')
      setValue('password', 'password123')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your QuizSpark account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/auth/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </div>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
            Demo Credentials
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('user')}
              className="w-full flex items-center justify-between p-3 text-xs bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Regular User</p>
                  <p className="text-gray-500 dark:text-gray-400">user@demo.com</p>
                </div>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-xs">Click to fill</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="w-full flex items-center justify-between p-3 text-xs bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Administrator</p>
                  <p className="text-gray-500 dark:text-gray-400">admin@demo.com</p>
                </div>
              </div>
              <span className="text-purple-600 dark:text-purple-400 text-xs">Click to fill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
