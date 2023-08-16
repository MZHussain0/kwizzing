import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import React from "react";

type Props = {
  accuracy: number;
};

const ResultCard = ({ accuracy }: Props) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center h-3/5">
        {accuracy > 75 && (
          <>
            <Trophy size={50} stroke="gold" className="" />
            <div className="flex flex-col text-2xl font-semibold text-yellow-400 text-center">
              <span>Impressive!</span>
              <span className="text-center text-muted-foreground text-sm opacity-50">
                You got {accuracy}% accurracy
              </span>
            </div>
          </>
        )}
        {accuracy > 25 && accuracy <= 75 && (
          <>
            <Trophy size={50} stroke="silver" className="" />
            <div className="flex flex-col text-2xl font-semibold text-slate-400 text-center">
              <span>Great!</span>
              <span className="text-center text-muted-foreground text-sm opacity-50">
                You got {accuracy}% accurracy
              </span>
            </div>
          </>
        )}
        {accuracy > 0 && accuracy <= 25 && (
          <>
            <Trophy size={50} stroke="red" className="" />
            <div className="flex flex-col text-2xl font-semibold text-rose-600 text-center">
              <span>Nice Try!</span>
              <span className="text-center text-muted-foreground text-sm opacity-50">
                You got {accuracy}% accurracy
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
