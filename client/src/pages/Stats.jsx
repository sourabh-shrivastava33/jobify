import { StatsContainer, ChartsContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/jobs/stats");
    return data;
  } catch (error) {
    return error;
  }
};
const Stats = () => {
  const { defaultStats, monthlyApplications } = useLoaderData();
  console.log(monthlyApplications);
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length >= 1 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};

export default Stats;
