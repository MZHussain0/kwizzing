import { getAuthSession } from "@/lib/nextAuth";
import React from "react";
import { redirect } from "next/navigation";
import QuizCreation from "./components/QuizCreation";

export const metadata = {
  title: "Quiz | Kwizzing",
  description: "Quiz",
};

type Props = {
  searchParams: {
    topic?: string;
  };
};

const QuizPage = async ({ searchParams }: Props) => {
  const session = await getAuthSession();

  if (!session) redirect("/");
  return <QuizCreation topicParams={searchParams.topic} />;
};

export default QuizPage;
