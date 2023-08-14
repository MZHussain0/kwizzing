import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

type Props = {};

const RecentActivities = (props: Props) => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>You have played total of 7 quizzes</CardDescription>
      </CardHeader>

      <CardContent className="max-h-[500px] overflow-scroll">
        Histories
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
