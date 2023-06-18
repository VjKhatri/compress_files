import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const history = useNavigate();

    const [inpval, setInpval] = useState({
      email: "",
      password: ""
    })

    const [data, setData] = useState([])
    console.log(inpval);

    const getdata = (e) => {
      
      const { value, name } = e.target;
      console.log(value, name);

      setInpval(() => {
        return {
          ...inpval,
          [name]: value
        }
      })

    }

    const addData = (e) => {
      e.preventDefault();
      const getuserArr = localStorage.getItem("userdetails");


      const { email, password } = inpval;
      if (email === "") {
        alert("Email is Required")
      } else if (!email.includes("@")) {
        alert("Please enter valid email address")
      } else if (password === "") {
        alert("Password is required")
      } else {
        if(getuserArr && getuserArr.length){
          const userdata = JSON.parse(getuserArr);
          const userlogin = userdata.filter((el,k)=>{
            return el.email === email && el.password === password
          });

          if(userlogin.length === 0)
          {
            alert("Invalid file")
          }else{
            console.log("User Login Successfully")
            localStorage.setItem("user_login",JSON.stringify(getuserArr))
            history("/upload")
          }
        }

      }

    }
    return (
      <>
      <div className='container mt-3'>
        <section>
          <div className='left' style={{ width: "100%" }}>
            <h3 className='text-center col-lg-4'>Sign In</h3>
            <Form>
              <Form.Group className="mb-3 col-lg-4" controlId="formBasicEmail">
                <Form.Control type="email" name='email' onChange={getdata} placeholder="Enter email" />

              </Form.Group>

              <Form.Group className="mb-3 col-lg-4" controlId="formBasicPassword">
                <Form.Control type="password" name='password' onChange={getdata} placeholder="Password" />
              </Form.Group>

              <Button variant="primary" style={{ background: "rgb(67, 185, 127)" }} onClick={addData} className='col-lg-4' type="submit" >
                Submit
              </Button>
            </Form>
           </div>
        </section>
      </div>
      </>
    )
  
}
export default Login