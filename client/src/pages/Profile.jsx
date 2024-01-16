import { FormRow } from "../components";
import customFetch from "../utils/customFetch";
import { useNavigation, Form, useOutletContext } from "react-router-dom";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { toast } from "react-toastify";
export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("avatar");
  if (file && file.size >= 500000) {
    console.log(file.size);
    toast.error("image is larger than 5 MB");
    return null;
  }
  try {
    await customFetch.patch("/users/update-user", formData);
    toast.success("user updated successfully!!");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return null;
};
const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, location, email } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              name="avatar"
              id="avatar"
            />
          </div>
          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow
            type="text"
            name="lastName"
            labelText="last name"
            defaultValue={lastName}
          />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save changes"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Profile;
