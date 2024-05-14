import {useEffect, useState} from 'react'
import './login.css'
import '../../App.css'
import {Link, useNavigate} from 'react-router-dom'
import Axios from 'axios'


const login = () => {
  
  const [current_th_regId, set_current_th_regId] = useState([]);
  const [loginUserName, setLoginUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigateTo = useNavigate()

  // hold the status of the 
  const [loginStatus, setLoginStatus] = useState('');
  const [statusHolder, setStatusHolder] = useState('hideMessage');

  // for the even handler, so it will check the password for multiple false attempts
  const [attempt, setAttempt] = useState('')


  const loginUser = (e) =>{
    e.preventDefault();

    Axios.post('http://localhost:3000/login', { 
    LoginUserName: loginUserName,   // creating objects
    LoginPassword: loginPassword
  }).then((responce)=>{

      // if message is received, which is console.log(responce)
      // index.js:  75. 'res.send({message: 'Credentials Dont Match'})'
    
      if(responce.data.message || loginUserName == '' || loginPassword == ''){
        navigateTo('/')
        setAttempt(new Date().toISOString())
        setLoginStatus('Credentials Don\'t Exist')
        console.log('Credentials Don\'t Exist')
      }
      else{
        const th_regId = responce.data[0].th_regId;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('LoggedUserId', th_regId);
        navigateTo('/dashboard') // if credentails match
      }
  })

    // Always update loginStatus to trigger the useEffect
    setLoginStatus(loginStatus => loginStatus);
}

  useEffect(()=>{
      if(loginStatus !== ''){
        setStatusHolder('showMessage')
        setTimeout(() => {
          setStatusHolder('hideMessage')
        }, 4000);
      }
    }
    ,[attempt, loginStatus]
  )

  // // Check if user is already logged in
  // useEffect(() => {
  //   const isLoggedIn = localStorage.getItem('isLoggedIn');
  //   if (isLoggedIn) {
  //     navigateTo('/dashboard');
  //   }
  // }, []);

  const onSubmitClearTheForm = ()=>{
      setLoginUserName ('')
      setLoginPassword('')
   }

  return (
    <div>
      <h3>Login</h3>
      <br/>

      <form action="" className="" onSubmit={onSubmitClearTheForm}>
        <span className={statusHolder}> {loginStatus}</span>

        <div className='inputdiv'>
          <label htmlFor="username"> Username</label>
            <div className='inputFlex'>
              {/*Also add icon here*/}
            <input type='text' id='username' placeholder='Enter username' onChange={ (event)=>{
              setLoginUserName(event.target.value)
            }}/>
          </div>
        </div>

        <div className='inputdiv'>
          <label htmlFor="password"> Password</label>
            <div className='inputFlex'>
              {/*Also add icon here*/}
            <input type='password' id='password' placeholder='Enter pass' onChange={(event) => {
              setLoginPassword(event.target.value)
            }}/>
          </div>
        </div>

        <div className='rememberMeDiv'>
          <input type="checkbox" id="rememberMe" name="rememberMe" />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        <span className='forgetPassword'>
          <Link to={'/'}>Forget Password?</Link>
        </span>

        <span className='loginButton'>
          <button type='submit' className='loginButton' onClick={loginUser}>
            Login
          </button>
        </span>

      </form>

      <br/>
      Dont have an account? <Link to={'/register'}>Sign up here </Link>
    </div>
  )
}

export default login