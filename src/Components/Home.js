import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { NavLink, useNavigate } from 'react-router-dom';

const Home = () => {

    const history = useNavigate();

    const [inpval,setInpval] = useState({
        name:"",
        email:"",
        password:""
    })

    const [data,setData] = useState([])
    console.log(inpval); 

    const getdata = (e)=>{
        // console.log(e.target.value);

        const {value, name} = e.target;
        console.log(value, name); 


        setInpval(()=>{
            return{
                ...inpval,
                [name]:value
            }
        })

    }

    const addData = (e)=>{
        e.preventDefault();
        
        const {name,email,password} = inpval;
        if(name === ""){
            alert("Name field is required")
        }else if(email === ""){
            alert("Email is Required")
        }else if (!email.includes("@")){
            alert("Please enter valid email address")
        }else if(password === ""){
            alert("Password is required")
        }else{
            console.log("data added succesfully");
            history("/login")
            localStorage.setItem("userdetails",JSON.stringify([...data,inpval]));

        }

    }



    return (
        <>
            <div className='container mt-3'>
                <section>
                    <div className='left' style={{width:"100%"}}>
                        <h3 className='text-center col-lg-4'>Sign Up</h3>
                        <Form>
                        <Form.Group className="mb-3 col-lg-4" controlId="formBasicName">
                                <Form.Control type="text" name='name' onChange={getdata} placeholder="Enter Your Name" />
                              
                            </Form.Group>
                            
                            <Form.Group className="mb-3 col-lg-4" controlId="formBasicEmail">
                                <Form.Control type="email" name='email' onChange={getdata} placeholder="Enter email" />
                              
                            </Form.Group>

                            <Form.Group className="mb-3 col-lg-4" controlId="formBasicPassword">
                                <Form.Control type="password" name='password' onChange={getdata} placeholder="Password" />
                            </Form.Group>
                            
                           <Button variant="primary" style={{background:"rgb(67, 185, 127)"}} onClick={addData} className='col-lg-4' type="submit" > 
                                Submit 
                            </Button>
                        </Form>
                        <p className='mt-3 col-lg-4'>Already Have an Account <span><NavLink to="/login">SignIn</NavLink></span> </p>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home