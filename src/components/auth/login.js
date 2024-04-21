import { connect } from "react-redux"
import { useState, useEffect } from "react"
import { login } from "../../redux/actions/auth"
import { Oval } from "react-loader-spinner"
import { Navigate } from "react-router-dom"
import { Link } from "react-router-dom"
// lo traemos para poder registrar el usuario
  function Login({
    login,
    loading
  }) {


   

    useEffect(() => {
      window.scrollTo(0,0)
    },[])


    const [ redirect, setRedirect] = useState(false)

    const [formData, setFormData] = useState({
      email:'',
      password:'',

    })

    const {
      email,
      password,
    } = formData;

    const onChange = e =>setFormData({ ...formData,[e.target.name]: e.target.value})
// con esta funcion lo que hacemos es que con cada una de las cosas que escribamos en los inputs react las captas y lo que escribamos en el campo name los pasa al campo value
 
    const onSubmit = e =>{
      e.preventDefault();
      console.log(formData)
      login(
        email,
        password,
        setRedirect(true)
)
    }
// esto lo que hace es tomar ese valor que colocamos en value y enviarlo

if (redirect && !loading) {
  return <Navigate to='/'/>
}

    return (
      <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={e=>onSubmit(e)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={e=>onChange(e)}
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={e=>onChange(e)}
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to={'/Recuperacion'} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
              {loading ? 
          <button
            className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Oval
            type="Oval"
            color="#fff"
            width={20}
            height={20}
            />
          </button>:
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                 Login
                </button>
                  }
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
    )
  }
  
  
  const mapStateToProps = state => ({
  loading: state.auth.loading
  })
  
  export default connect (mapStateToProps,{
    // funciones que queremos traer
    login
  }) (Login)