"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation";
import { useTransition } from "react";


export default function Likes ({post,addOptimisticPost}:{post:PostWithAuthor,addOptimisticPost:(newPost:PostWithAuthor) => void}) {
    const router = useRouter();
    const [isPending,startTransition] = useTransition();

    const handleClick = async() => {
        addOptimisticPost({
            ...post,
            likes:post.likes - 1,
            user_has_liked_post:!post.user_has_liked_post,
        })
        const supabase = createClientComponentClient();
        const {data:{user}} = await supabase.auth.getUser();
        if(post.user_has_liked_post){
            await supabase.from("likes").delete().match({user_id:user?.id,post_id:post.id})
        }else{
            addOptimisticPost({
                ...post,
                likes:post.likes + 1,
                user_has_liked_post:!post.user_has_liked_post,
            })
            await supabase.from("likes").insert({user_id:user?.id,post_id:post.id});
        }
        router.refresh()
    }
    return <button onClick={() => startTransition(() => handleClick())}>{post.likes}いいね</button>
}