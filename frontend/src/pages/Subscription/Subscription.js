import React from 'react'
import './Subscription.css'
import TwitterIcon from '@mui/icons-material/Twitter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { format, addMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
    const app = auth;
    const [user] = useAuthState(app);

    const navigate = useNavigate();

    const subscribe = async (amount) => {
        const { data: { key } } = await axios.get("http://www.localhost:5000/getkey");
        const { data: { order } } = await axios.post("http://localhost:5000/checkout", {
            amount: amount,
        })

        var options = {
            key,
            "amount": amount,
            "currency": "INR",
            "name": "Swapnil Sunil Sinha",
            "description": "Website like Twitter",
            "image": "https://i.pinimg.com/originals/d8/0a/b1/d80ab1d4fd4956d163d491b6ec0e8438.jpg",
            "order_id": order.id,
            "handler": async function (response) {
                const body = {
                    ...response,
                }

                const validate = await fetch("http://localhost:5000/paymentVerify", {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                const jsonverify = await validate.json();

                if (jsonverify.success == true) {
                    toast.success("Congratulations!! you are now a subscribed user");
                    //action here
                    var subs = "";
                    if (amount == "50") {
                        subs = "silver";
                    }
                    else {
                        subs = "gold"
                    }
                    const currentDate = new Date();
                    const expiryDate = addMonths(currentDate, 1);
                    const formattedDate = format(expiryDate, 'yyyy-MM-dd');
                    const editedInfo = {
                        subscription: subs,
                        subsExpAt: formattedDate.toString(),
                    }
                    fetch(`http://localhost:5000/userUpdates/${user?.email}`, {
                        method: "PATCH",
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(editedInfo),
                    })
                        .then(res => res.json())
                }
                else {
                    toast.error("Payment failed!! Try again")
                }

                navigate('/');
            },
            "prefill": {
                "name": "Swapnil",
                "email": "swapnil852.hitece2020@gmail.com",
                "contact": "9000090000"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });

        rzp1.open();
    }

    return (
        <>
            <Toaster toastOptions={{ duration: 4000 }} />
            <div className='box'>
                <div className='head'>
                    <h1>Your Plan,</h1>
                    <h1>Your Tweet</h1>
                    <p>The different plans offers seamless user experience with different limitation of posting tweets in a single day.</p>
                </div>
                <div className='cards'>
                    <div className='card'>
                        <TwitterIcon style={{ color: 'skyblue', margin: '10px' }} />
                        <h2>Regular Plan</h2>
                        <p>
                            <CheckCircleOutlineIcon style={{ color: 'skyblue', margin: '10px' }} />
                            <span>Single tweet per day.</span>
                        </p>
                        <h3>Free</h3>
                        <h3>Default Plan</h3>
                    </div>
                    <div className='card'>
                        <TwitterIcon style={{ color: 'skyblue', margin: '10px' }} />
                        <h2>Silver Plan</h2>
                        <p>
                            <CheckCircleOutlineIcon style={{ color: 'skyblue', margin: '10px' }} />
                            <span>Five tweets per day.</span>
                        </p>
                        <h3>&#8377; 50 / month</h3>
                        <button onClick={(event) => subscribe(50)}>Subscribe</button>
                    </div>
                    <div className='card'>
                        <TwitterIcon style={{ color: 'skyblue', margin: '10px' }} />
                        <h2>Gold Plan</h2>
                        <p>
                            <CheckCircleOutlineIcon style={{ color: 'skyblue', margin: '10px' }} />
                            <span>Unlimited tweets per day.</span>
                        </p>
                        <h3>&#8377; 100 / month</h3>
                        <button onClick={(event) => subscribe(100)}>Subscribe</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Subscription
