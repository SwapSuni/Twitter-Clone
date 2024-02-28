import React, { useEffect, useState } from 'react'
import '../More/More.css'
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoIcon from '@mui/icons-material/Info';
import { auth } from '../../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { format, addMonths } from 'date-fns';

const More = () => {
  const app = auth;
  const [user] = useAuthState(app);

  const [isverify, setIsverify] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`http://localhost:5000/Isverified?email=${user.email}`);
      // console.log(res.data.verified);
      setIsverify(res.data.verified);
    })();

  }, [isverify]);

  const verification = async () => {
    const res = await axios.get(`http://localhost:5000/userPost?email=${user?.email}`);
    const len = (res.data.length);
    if (len <= 3) {
      toast.error("You are not eligible for verification")
    }
    else {
      const { data: { key } } = await axios.get("http://www.localhost:5000/getkey")

      const { data: { order } } = await axios.post("http://localhost:5000/checkout", {
        amount: 500,
      })

      var options = {
        key,
        "amount": "50000",
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
          // console.log(jsonverify);
          // console.log(jsonverify.success);
          if (jsonverify.success == true) {
            toast.success("Congratulations!! you are now a verified user");
            const currentDate = new Date();
            const expiryDate = addMonths(currentDate, 1);
            const formattedDate = format(expiryDate, 'yyyy-MM-dd');
            const editedInfo = {
              verified: true,
              expiresAt: formattedDate.toString(),
            }
            fetch(`http://localhost:5000/userUpdates/${user?.email}`, {
              method: "PATCH",
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify(editedInfo),
            })
              .then(res => res.json())

            setIsverify(true);
          }
          else {
            toast.error("Payment failed!! Try again")
          }
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
  }

  return (
    <div className='page'>
      {
        user.email ? (
          <>
            <Toaster toastOptions={{ duration: 4000 }} />
            {
              isverify ? (
                <div className='main'>
                  <h2>Hey there </h2>
                  <h1> {
                    user?.email.split('@')[0]
                  } <VerifiedIcon /> </h1>
                </div>
              ) : (
                <div className='main'>
                  <h2>Become a</h2>
                  <h1>Verified User <VerifiedIcon /></h1>
                  <span>
                    <button onClick={verification}>Request for Verification</button>
                    <InfoIcon style={{ color: "skyblue", blockSize: "50%" }} className='info' />
                    <p className='desc'>A premium verification system for public
                      figures, celebrities, and influencers.
                      You can apply for account verification for
                      a fee of INR 500 pm, receiving a
                      prestigious badge that signifies your authenticity.
                      <p>Eligibility</p>
                      <span>Tweet count must be more than ten</span>
                    </p>
                  </span>
                </div>
              )
            }
          </>
        ) : (
          <div className='main'>
            <h2>Please fill in your details before proceeding further..</h2>
          </div>
        )
      }

    </div>
  )
}
export default More