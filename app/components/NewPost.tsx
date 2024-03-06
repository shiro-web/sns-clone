import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import {cookies} from "next/headers"


export default function NewPost() {
    const addPost = async (formData:FormData) => {
        "use server";
        const title =String(formData.get("title"));
        const supabase = createServerActionClient<Database>({cookies});
        const {data:{user}} = await supabase.auth.getUser();
        await supabase.from("posts").insert({title,user_id:user?.id});

        revalidatePath("/")
    }
    return <form action={addPost}>
        <input type="text" name="title" className="border border-slate-700"/>
    </form>
}