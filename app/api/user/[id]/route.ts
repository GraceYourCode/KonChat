import Users from "@/models/user";
import { connectToDB } from "@/utils/database"

export const GET = async (req: Request, {params}: {params: any}) => {
  try {
    await connectToDB();

    const user = await Users.findById(params.id);

    return new Response (JSON.stringify(user));
  } catch (error: any) {
    return new Response (JSON.stringify(error.message));
  }
}