import { connect } from "@/lib/db";
import { Blog } from "@/lib/models/blog.model";
import { Category } from "@/lib/models/category.model";
import User from "@/lib/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  try {
    const blogId = context.params.blogId;
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
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(JSON.stringify({ messge: "No blog found" }), {
        status: 404,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "successful", blog: blog })
    );
  } catch (error) {
    return new NextResponse("Error in getting single blog", { status: 500 });
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  try {
    const blogId = context.params.blogId;
    const { title, description } = await request.json();
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid blogId or missing blogId" }),
        { status: 400 }
      );
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "No user found" }), {
        status: 404,
      });
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 404,
      });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({ message: "blog updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in updating blog", { status: 500 });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  try {
    const blogId = context.params.blogId;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ messaage: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "No user found" }), {
        status: 404,
      });
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 404,
      });
    }
      await Blog.findByIdAndDelete(blogId)
      return new NextResponse(JSON.stringify({message: "Blog deleted successfully"}), { status: 200})
  } catch (error) {
    return new NextResponse("Error in deleting blog", { status: 500 });
  }
};
