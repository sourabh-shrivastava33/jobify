import { useState } from "react";
import AreaCharts from "./AreaCharts";
import BarCharts from "./BarCharts";
import styled from "styled-components";
// import Wrapper from "../assets/wrappers/ChartsContainer";
const Wrapper = styled.section`
  margin-top: 1.75rem;
  text-align: center;
  button {
    background: transparent;
    border: transparent;
    text-transform: capitalize;
    font-size: 1.25rem;
    color: var(--primary-500);
    cursor: pointer;
  }
  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
  }
`;

const ChartsContainer = ({ data }) => {
  const [barCharts, setBarCharts] = useState(true);
  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarCharts(!barCharts)}>
        {barCharts ? "Area chart" : "Bar chart"}
      </button>
      {barCharts ? <BarCharts data={data} /> : <AreaCharts data={data} />}
    </Wrapper>
  );
};

export default ChartsContainer;
