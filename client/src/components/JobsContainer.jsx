import React from "react";
// import Wrapper from "../assets/wrappers/JobsContainer";
import { useAllJobsContext } from "../pages/AllJobs";
import Job from "./Job";
import styled from "styled-components";
import PageBtnContainer from "./PageBtnContainer";
const Wrapper = styled.section`
  margin-top: 4rem;
  text-transform: none;
  & > h5 {
    font-weight: 700;
    margin-bottom: 1rem;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 1120px) {
    .jobs {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }
`;

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs, totalJobs, totalPages } = data;
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{totalJobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {totalPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;
