import { connect } from "@/lib/db";
import { Blog } from "@/lib/models/blog.model";
import { Category } from "@/lib/models/category.model";
import User from "@/lib/models/user.model";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ messag: "Invalid userID" }), {
        status: 400,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing CategoryId" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        { status: 404 }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };
    const blogs = await Blog.find(filter);
    return new NextResponse(
      JSON.stringify({ messge: "successful", blogs: blogs }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in fetching all blogs", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const body = await request.json();
    const { title, description } = body;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ messag: "Invalid userID" }), {
        status: 400,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing CategoryId" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        { status: 404 }
      );
    }
      
      const newBlog = new Blog({
          title,
          description,
          user: new Types.ObjectId(userId),
          category: new Types.ObjectId(categoryId)
      })

      await newBlog.save()
      return new NextResponse(JSON.stringify({message: "Blog created", blog: newBlog}), { status: 200})
      
  } catch (error) {
    return new NextResponse("Error in creating post", { status: 500 });
  }
};
