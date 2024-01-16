/* eslint-disable react-refresh/only-export-components */
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import { useLoaderData } from "react-router-dom";
import { createContext, useContext } from "react";
export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/jobs", {
      params,
    });
    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
const AllJobContext = createContext();
const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
  return (
    <AllJobContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobContext.Provider>
  );
};
export const useAllJobsContext = () => useContext(AllJobContext);

export default AllJobs;
