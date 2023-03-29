const Usercollection = require('../Models/UserCollection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Signup
exports.signup = async(req,res)=>{
            let {Email,Password,Username} = req.body;
            let filter = {Email:Email};
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(Password , salt);
                  Password = hash ;
            let count = await Usercollection.find(filter).count()
            if(count === 0){
                let data={
                       Username:Username,
                       Email,
                       Password
                    };
                    console.log("process.env.email",process.env.email);
               Usercollection.create(data).then(result=>{

                let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.email,
                    pass: process.env.password
                  }
                }); 
                                 
                let confirmationLink = `http://localhost:3000/confirm/${result._id}`;
                 
                let mailOptions = {
                  from: process.env.email,
                  to: Email,
                  subject: 'Confirm your account',
                  html: `<p>Dear , ${Username}</p>
                          <p>Please click on this <a href="${confirmationLink}">link</a> to confirm your account.</p>`
                };
                
                transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                res.status(201).json({ message:"SignUp Successfully",sigup:true })
               })
               .catch(err=>{
                     res.status(505).json({ message:"Error in database", Error:err , sigup:false})
                    })
            }
            else{
                res.status(200).json({ message:"User Already Exist Please Continue Login", sigup:false})
            }
}

// login
exports.login = async(req,res)=>{
     let {Email,Password} = req.body;
     let filter  = {Email : Email};
     let count = await Usercollection.find(filter).count();
     if(count === 0){
         res.status(404).json({ message:"User Not Exist Please continue Signup" ,login:false  });
     }
     else{
      Usercollection.find(filter)
      .then(result=>{
        console.log("result",result);
       bcrypt.compare(Password, result[0].Password,(err,response)=>{
              if(response){               
                const token = jwt.sign({ Email: result[0].Email ,isAdmin:result[0].IsAdmin }, process.env.SecreteKey);
                res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true }).status(201).json({ login: true, token });
              }
              else{
                return res.json({ login: false, message: 'Invalid  password' });
              }
        });
       
      })
      .catch(error=>{
        res.status(505).json({ message:"Error in Database" ,login:false ,error:error  })
      })
     }
}

exports.confirmation = async(req,res)=>{
                  let id = req.params.id ;
                  let count =  Usercollection.find({_id:id}).count();
                  if(count === 0 ){
                    res.status(404).json({message:"Your account is not Confirmed",update:false})
                  }
                  else{
                    let query = {_id : id};
                    let newdata = {IsAdmin:true};
                    Usercollection.updateOne(query,newdata).then(result=>{
                       res.status(204).json({message:"Your account is Confirmed",update:true})
                    })
                    .catch(err=>{
                      res.status(505).json({message:"error in database",update:false})
                    })
                  }
}