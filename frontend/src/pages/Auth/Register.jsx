// import { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { useForm } from 'react-hook-form'
// import { toast } from 'react-hot-toast'
// import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
// import { register as registerUser, reset } from '../../store/slices/authSlice'

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
  
//   const { user, isLoading, isError, isSuccess, message } = useSelector(
//     (state) => state.auth
//   )

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm()

//   const password = watch('password')

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
//     const { confirmPassword, ...userData } = data
//     dispatch(registerUser(userData))
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-xl">Q</span>
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
//             Join QuizSpark and start your learning journey
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-4">
//             {/* Name Fields */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register('firstName', {
//                       required: 'First name is required',
//                       minLength: {
//                         value: 2,
//                         message: 'First name must be at least 2 characters'
//                       }
//                     })}
//                     type="text"
//                     className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
//                     placeholder="First name"
//                   />
//                 </div>
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors.firstName.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Last Name
//                 </label>
//                 <input
//                   {...register('lastName', {
//                     required: 'Last name is required',
//                     minLength: {
//                       value: 2,
//                       message: 'Last name must be at least 2 characters'
//                     }
//                   })}
//                   type="text"
//                   className={`input ${errors.lastName ? 'input-error' : ''}`}
//                   placeholder="Last name"
//                 />
//                 {errors.lastName && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors.lastName.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Username Field */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Username
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   {...register('username', {
//                     required: 'Username is required',
//                     minLength: {
//                       value: 3,
//                       message: 'Username must be at least 3 characters'
//                     },
//                     pattern: {
//                       value: /^[a-zA-Z0-9_]+$/,
//                       message: 'Username can only contain letters, numbers, and underscores'
//                     }
//                   })}
//                   type="text"
//                   className={`input pl-10 ${errors.username ? 'input-error' : ''}`}
//                   placeholder="Choose a username"
//                 />
//               </div>
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>

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
//                     required: 'Password is required',
//                     minLength: {
//                       value: 6,
//                       message: 'Password must be at least 6 characters'
//                     },
//                     pattern: {
//                       value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                       message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
//                     }
//                   })}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
//                   placeholder="Create a password"
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

//             {/* Confirm Password Field */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   {...register('confirmPassword', {
//                     required: 'Please confirm your password',
//                     validate: value => value === password || 'Passwords do not match'
//                   })}
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Terms and Conditions */}
//           <div className="flex items-center">
//             <input
//               {...register('acceptTerms', {
//                 required: 'You must accept the terms and conditions'
//               })}
//               id="accept-terms"
//               type="checkbox"
//               className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//             />
//             <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
//               I agree to the{' '}
//               <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
//                 Terms and Conditions
//               </Link>{' '}
//               and{' '}
//               <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
//                 Privacy Policy
//               </Link>
//             </label>
//           </div>
//           {errors.acceptTerms && (
//             <p className="text-sm text-red-600 dark:text-red-400">
//               {errors.acceptTerms.message}
//             </p>
//           )}

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
//                   Creating account...
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Create account
//                 </div>
//               )}
//             </button>
//           </div>

//           {/* Sign In Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Already have an account?{' '}
//               <Link
//                 to="/auth/login"
//                 className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
//               >
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Register

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Shield } from 'lucide-react'
import { register as registerUser, reset } from '../../store/slices/authSlice'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'user'
    }
  })

  const password = watch('password')

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
    const { confirmPassword, acceptTerms, ...userData } = data
    dispatch(registerUser(userData))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join QuizSpark and start your learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Username can only contain letters, numbers, and underscores'
                    }
                  })}
                  type="text"
                  className={`input pl-10 ${errors.username ? 'input-error' : ''}`}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

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
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role Selection Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Type
              </label>
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    {...register('role')}
                    id="role-user"
                    type="radio"
                    value="user"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <label htmlFor="role-user" className="block text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
                        Regular User
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Take quizzes and track your progress
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    {...register('role')}
                    id="role-admin"
                    type="radio"
                    value="admin"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <label htmlFor="role-admin" className="block text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
                        Administrator
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Manage quizzes, users, and system settings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              {...register('acceptTerms', {
                required: 'You must accept the terms and conditions'
              })}
              id="accept-terms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.acceptTerms.message}
            </p>
          )}

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
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create account
                </div>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
