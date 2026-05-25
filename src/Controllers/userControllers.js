import RefreshToken from "../Models/RefreshToken.js";
import User from "../Models/Users.js";
import bcrypt from "bcryptjs"
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export async function userRegister(req, res) {
  try {
    const { username, password, email, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email is already exist" });
      
    }

    const role = email === process.env.ADMIN_SECRET ? "admin" : "user";

    const user = await User.create({
      username,
      email,
      password,
      phone,
      role,
    });

    if (user) {
      res.status(200).json({
        user,
      });
    } else {
      res.status(400).json({message:"Something went wrong"})
      
    }
  } catch (error) {
    // res.status(500).json({ message: "ဆာဗာအတွင်း အမှားအယွင်းရှိနေပါသည်" });
      console.log(error);
  
  res.status(500).json({
    message: error.message,
  })}
}

export async function userLogin(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "username သို့မဟုတ် password မှားယွင်းနေပါသည်" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({ token: refreshToken, userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, role: user.role });
  } catch (error) {
    // res.status(500).json({ message: "ဆာဗာအတွင်း အမှားအယွင်းရှိနေပါသည်" });
          console.log(error);
  
  res.status(500).json({
    message: error.message,
  })}
  
}

export async function userLogout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Database ထဲမှ ဖျက်ထုတ်ခြင်း
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Cookie အား ရှင်းလင်းခြင်း
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "အောင်မြင်စွာ ထွက်ခွာပြီးပါပြီ" });
  } catch (error) {
    // res.status(500).json({ message: "ဆာဗာအတွင်း အမှားအယွင်းရှိနေပါသည်" });
          console.log(error);
  
  res.status(500).json({
    message: error.message,
  })
  }
}
