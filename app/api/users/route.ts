import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/lib/models/user.model";
import { Types } from "mongoose";

const objectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "user is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse("Error in Creating new user", { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "UserId or username is not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }

    const verifyUser = await User.findOne({ username: newUsername });
    if (!verifyUser) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: newUsername },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({ message: "user updated", user: updatedUser }),
      { status: 500 }
    );
  } catch (error) {
    return new NextResponse("Error in updating user", { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const searchParmas: any = new URL(request.url);
    const userId = searchParmas.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "UserId or username is not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }
      
      await connect()

      const deleteUser = await User.findByIdAndDelete(userId)
      if (!deleteUser) {
          return new NextResponse(JSON.stringify({ message: "No user found" }), { status: 404})
      }

      return new NextResponse(JSON.stringify({message: "User is deleted"}), { status: 200})
  } catch (error) {
    return new NextResponse("Error in deleting user", { status: 500 });
  }
};
