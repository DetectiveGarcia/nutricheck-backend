import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()
export async function userExist(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    return !!user
}

