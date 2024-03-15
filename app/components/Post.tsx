"use client"

import { useEffect, useOptimistic } from "react";
import Likes from "./Likes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { channel } from "diagnostics_channel";

export default function Post({posts}:{posts:PostWithAuthor[]}) {
    const[optimisticPosts,addOptimisticPost] = useOptimistic<PostWithAuthor[],PostWithAuthor>(
        posts,
        (currentOptimisticPosts,newPost) => {
            const newOptimisticPosts = [...currentOptimisticPosts];
            const index = newOptimisticPosts.findIndex((post) => {post.id === newPost.id});
            newOptimisticPosts[index] = newPost;
            return newOptimisticPosts;
        });

        const supabase = createClientComponentClient();
        const router = useRouter();

        useEffect(() => {
          const channel = supabase.channel("realtime posts").on("postgres_changes",{
            event:"*",
            schema:"public",
            table:"posts",
          },
          (payload) => {
            console.log(payload);
            router.refresh();
          }
        ).subscribe();

        return() => {
          supabase.removeChannel(channel)
        }
        },[supabase,router])

    return(
        <div>
            {posts?.map((post) => (
                <div key={post.id}>
                  <p>
                    {post.author?.name}{post.author?.username}
                  </p>
            
                  <p>{post.title}</p>
                  <p><Likes post={post} addOptimisticPost={addOptimisticPost}/></p>
                </div>
              ))}
        </div>
    )
}