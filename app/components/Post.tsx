"use client"

import { useOptimistic } from "react";
import Likes from "./Likes";

export default function Post({posts}:{posts:PostWithAuthor[]}) {
    const[optimisticPosts,addOptimisticPost] = useOptimistic<PostWithAuthor[],PostWithAuthor>(
        posts,
        (currentOptimisticPosts,newPost) => {
            const newOptimisticPosts = [...currentOptimisticPosts];
            const index = newOptimisticPosts.findIndex((post) => {post.id === newPost.id});
            newOptimisticPosts[index] = newPost;
            return newOptimisticPosts;
        });

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