const model = require('../model/userinformation');
const userdata = model.Userdatas;
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

// signup function
exports.createuser = async(req,res)=>{
  try {
    const userData = new userdata(req.body);
    const userExists = await userdata.findOne({
      $or: [
        { number: req.body.number },
        { email: req.body.email }
      ]
    });
    if (userExists) {
      return res.status(400).json({ message: 'Account already exists.' });
    }
      const hash = bcrypt.hashSync(req.body.password, 10);
      userData.password = hash;
      var token = jwt.sign({ email: req.body.email }, 'shhhhh');
      userData.token = token;
      const otp = Math.floor(1000 + Math.random() * 9000);
      const OTP = otp.toString();
      userData.otp = OTP;
      let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'nitinkumarvasdhani786@gmail.com',
              pass: 'kyze puwm bvxi anbd'
          }
      });
      let mailOptions = {
          from: 'nitinkumarvasdhani786@gmail.com',
          to: req.body.email,
          subject: 'OTP to  verify your account',
          text: `Your OTP is ${OTP}`,
      };
      await userData.save();
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      res.status(201).send('OTP sent to your email successfully');
    } catch (error) {
      res.status(500).json({ message: 'An error is occurred in creating user.' });
    }
}

// signup otp check function
exports.verifySignupOTP = async (req, res) => {
  try {
    const submittedOTP  = req.body.otp;
    
    const user = await userdata.findOne({email:req.body.email});
    if (user.otp !== submittedOTP) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (user.otp) {
      user.otp = undefined;
      await user.save(); 
    }
    res.status(201).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: 'An error occurred while verifying OTP.' });
  }
}

// login function
exports.verifyuser = async(req,res)=>{
    try {
      const userinfo = await userdata.findOne({ number: req.body.number });
      const ispassword = bcrypt.compareSync(req.body.password, userinfo.password);
      if (!ispassword || !userinfo) {
        res.status(400).json({ message: "Credentials are wrong" });
      }
      else if (ispassword || userinfo){
        res.status(201).json({ message: "Login successfully", userinfo });
      }
    }
    catch (error) {
      res.status(500).json({ message: "Your account is not created yet, create your account first" });
    }
}

// forget password function
exports.forgetPassword = async (req, res) => {
  try {
      const user = await userdata.findOne({email:req.body.email});
      if (!user) {
        return res.status(400).json({ message: 'User not found.' });
      }
    
      const otp = Math.floor(1000 + Math.random() * 9000);
      const OTP = otp.toString();
      user.otp = OTP;

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nitinkumarvasdhani786@gmail.com',
          pass: 'kyze puwm bvxi anbd'
        }
      });
      let mailOptions = {
        from: 'nitinkumarvasdhani786@gmail.com',
        to: req.body.email,
        subject: 'OTP to verify your account',
        text: `Your OTP is ${OTP}`,
      };
      
      await user.save(); 
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      res.status(201).send('OTP sent to email successfully.');
    } catch (error) {
      res.status(500).json({ message: 'OTP is not sent successfully.' });
    }
}


// forget password otp check function
exports.verifyForgetPasswordOTP = async (req, res) => {
  try {
    const submittedOTP  = req.body.otp;
    const user = await userdata.findOne({email:req.body.email});
    if (user.otp !== submittedOTP) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (user.otp) {
      user.otp = undefined;
      await user.save(); 
    }
    res.status(201).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: 'An error occurred while verifying OTP.' });
  }
}


// reset password otp check function
exports.verifyResetPassword = async (req, res) => {
  try {
    const user = await userdata.findOne({email:req.body.email});
    const hash = bcrypt.hashSync(req.body.password, 10);
    user.password = hash;
    await user.save(); 
    res.status(201).json({ message: 'Password is reset successfully.' });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: 'An error occurred while reseting your password.' });
  }
}
// auth completed







exports.getLoginUserDetail = async(req,res)=>{
  try {
    const loginuserinfo = await userdata.findOne({token:req.query.token})
    res.status(201).json(loginuserinfo)
    }
    catch (error) {
      res.status(400).json({ message: "Your account is not created yet, create your account first" });
    }
}


exports.getAllUserDetailOtherThanLoginUser = async(req,res)=>{
  try {
    const allUserInfo = await userdata.find({ statusFlag: 1 });
    res.status(201).json(allUserInfo)
    }
    catch (error) {
      res.status(400).json({ message: "Your account is not created yet, create your account first" });
    }
}



exports.LoginUserDetailUpdate = async (req, res) => {
  try {
    const loginuserinfo = await userdata.findOne({ token: req.query.token });
    if (!loginuserinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    loginuserinfo.pic = req.body.pic;
    loginuserinfo.name = req.body.name;
    loginuserinfo.email = req.body.email;
    loginuserinfo.bio = req.body.bio;
    await loginuserinfo.save();

    res.status(201).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


exports.getSearchUserDetail = async(req,res)=>{
  try {
  const searchUserInfo = await userdata.findOne({number : req.body.number})
  res.status(201).json(searchUserInfo)
  }
  catch (error) {
    res.status(400).json({ message: "Account does not exist from this number" });
  }
}

exports.SearchUserStatusUpdate = async(req,res)=>{
  try {
    const searchUserInfoStatusUpdate = await userdata.findOne({ _id: req.query._id })
    searchUserInfoStatusUpdate.statusFlag = req.body.statusFlag;
    await searchUserInfoStatusUpdate.save();
    res.status(201).json(searchUserInfoStatusUpdate)
  }
  catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.getUserDetailsWhichIsClick = async(req,res)=>{
    try {
      const UserData = await userdata.findById({ _id : req.query._id });
      res.status(200).json(UserData);
      }
      catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error in fetching user which is click" });
      }
}


