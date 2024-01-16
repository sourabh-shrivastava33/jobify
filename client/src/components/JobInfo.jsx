import Wrapper from "../assets/wrappers/JobInfo";

const JobInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="job-icon">{icon}</span>
      <div className="job-text">{text}</div>
    </Wrapper>
  );
};

export default JobInfo;
