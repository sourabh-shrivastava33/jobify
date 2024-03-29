import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, Link, useSubmit } from "react-router-dom";
import { FormRow, FormRowSelect } from ".";
import { JOB_STATUS, JOB_TYPE, JOB_SORT_BY } from "../../../utils/constants";
import { useAllJobsContext } from "../pages/AllJobs";
const SearchContainer = () => {
  const submit = useSubmit();
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };
  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            defaultValue={jobStatus}
            list={["all", ...Object.values(JOB_STATUS)]}
            onChange={(e) => submit(e.currentTarget.form)}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            defaultValue={jobType}
            list={["all", ...Object.values(JOB_TYPE)]}
            onChange={(e) => submit(e.currentTarget.form)}
          />
          <FormRowSelect
            name="sort"
            defaultValue={sort}
            list={Object.values(JOB_SORT_BY)}
            onChange={(e) => submit(e.currentTarget.form)}
          />
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;
