"use client";
import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";

const PromptCardList = ({
  data,
  handleTagClick,
}: {
  data: any[];
  handleTagClick: (post: any) => void;
}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data && data.length
        ? data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleTagClick={() => handleTagClick(post)}
              handleEdit={undefined}
              handleDelete={undefined}
            />
          ))
        : null}
    </div>
  );
};

const Feed = () => {
  const { data: session } = useSession();
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchedResult, setSearchedResult] = useState([]);

  const filterPrompts = (searchText: string) => {
    return posts.filter(
      (i: any) =>
        i.creator.username?.includes(searchText) ||
        i.tag?.includes(searchText) ||
        i.prompt?.includes(searchText)
    );
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
    const searchResult = filterPrompts(e.target.value);
    setSearchedResult(searchResult);
  };

  const handleTagClick = (post: any) => {
    setSearchText(post.tag);
    const searchResult = filterPrompts(post.tag);
    setSearchedResult(searchResult);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("api/prompt");

      const data = await response.json();

      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    session && (
      <section className="feed">
        <form className="relative w-full flex-center">
          <input
            type="text"
            placeholder="Search for a tag or a username"
            value={searchText}
            onChange={handleSearchChange}
            required
            className="search_input peer"
          />
        </form>

        <PromptCardList
          data={searchedResult?.length ? searchedResult : posts}
          handleTagClick={(post) => handleTagClick(post)}
        />
      </section>
    )
  );
};

export default Feed;
