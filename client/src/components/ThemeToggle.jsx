import { BsSunFill, BsMoonFill } from "react-icons/bs";
import Wrapper from "../assets/wrappers/ThemeToggle";
import { useDashboardContext } from "../pages/DashboardLayout";

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useDashboardContext();
  return (
    <Wrapper onClick={toggleTheme}>
      {isDarkTheme ? (
        <BsSunFill className="toggle-icon" />
      ) : (
        <BsMoonFill className="toggle-icon" />
      )}
    </Wrapper>
  );
};

export default ThemeToggle;
