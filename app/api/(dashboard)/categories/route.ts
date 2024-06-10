import { connect } from "@/lib/db";
import { Category } from "@/lib/models/category.model";
import User from "@/lib/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    try {
        const searchParmas: any = new URL(request.url)
        const userId = searchParmas.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid or missing userId'}), { status: 400})
        }

        await connect();
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404})
        }

        const categories = await Category.find({ user: userId })
        
        return new NextResponse(JSON.stringify(categories), {status: 200})
    } catch (error) {
       return new NextResponse("Error in getting categories", { status: 500}) 
    }
}

export const POST = async (request: Request) => {
    try {
        const searchParmas: any = new URL(request.url);
        const userId = searchParmas.get("userId")

        const { title } = await request.json()

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid UserId or no userId"}), { status: 400})
        }

        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({message: "NO user found"}), { status: 404})
        }

        const newCategory = new Category({
            title: title,
            user: user._id
        })

        await newCategory.save()

        return new NextResponse(JSON.stringify({message: "New category created", category: newCategory}), { status: 201})

    } catch (error) {
        return new NextResponse("Error in creating a category", { status: 500})
    }
}