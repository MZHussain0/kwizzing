import { getAuthSession } from "@/lib/nextAuth";
import React from "react";
import { redirect } from "next/navigation";
import QuizCreation from "./components/QuizCreation";

export const metadata = {
  title: "Quiz | Kwizzing",
  description: "Quiz",
};

type Props = {};

const QuizPage = async (props: Props) => {
  const session = await getAuthSession();

  if (!session) redirect("/");
  return <QuizCreation />;
};

export default QuizPage;
