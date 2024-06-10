import { connect } from "@/lib/db"
import { Category } from "@/lib/models/category.model"
import User from "@/lib/models/user.model"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, context: {params: any}) => {
    try {
        const categoryId = context.params.categoryId
        const body = await request.json()
        const { title } = body
        
        const searchParmas = new URL(request.url)
        const userId = searchParmas.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "invalid userId or missing userId"}), { status: 400})
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({message: "Invalid or missing categoryId"}), { status: 400})
        }
        await connect()

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }), { status: 404})
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title}, {new: true})
        if (!updatedCategory) {
            return new NextResponse(JSON.stringify({message: "category not found"}), {status: 404})
        }

        return new NextResponse(JSON.stringify({ message: "User updated", category: updatedCategory }), {status: 200})
    } catch (error) {
        return new NextResponse("Error in making patch request", {status: 500})
    }
}