"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("🤪 ~ file: page.tsx:10 : ", session);

  const [posts, setPosts] = useState([]);

  const handleEdit = (post: any) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post: any) => {
    const hasConfirmed = confirm("Are you sure want to delete this prompt");
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, { method: "DELETE" });
        const filteredPosts = posts.filter((p: any) => p._id === post.id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`api/users/${session?.user?.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if (session?.user?.id) {
      fetchPosts();
    }
  }, [session?.user?.id]);

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
