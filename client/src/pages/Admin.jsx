/* eslint-disable react-refresh/only-export-components */
import React from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
// import Wrapper from "../assets/wrappers/StatsContainer";
import { redirect, useLoaderData } from "react-router-dom";
import StatItem from "../components/StatItem";
import { FaRegCalendarCheck, FaSuitcaseRolling } from "react-icons/fa";
import styled from "styled-components";
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/admin/app-stats");
    return data;
  } catch (error) {
    toast.error("You are not authorized to view this page");
    return redirect("/dashboard");
  }
};
const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const Admin = () => {
  const { users, jobs } = useLoaderData();
  return (
    <Wrapper>
      <StatItem
        count={users}
        title="current user"
        color="#e9b949"
        bcg="#fcefc7"
        icon={<FaSuitcaseRolling />}
      />
      <StatItem
        count={jobs}
        title="total jobs"
        color="#647acb"
        bcg="#e0e8f9"
        icon={<FaRegCalendarCheck />}
      />
    </Wrapper>
  );
};

export default Admin;
