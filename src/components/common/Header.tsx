import { PanelHeader } from "@vkontakte/vkui";
import { Link } from "react-router-dom";

export const Header = () => (
  <PanelHeader
    style={{
      position: "sticky",
      top: 0,
      zIndex: 1,
      backgroundColor: "var(--vkui--color_background)",
    }}
    separator={false}
  >
    <Link
      to="/"
      style={{ marginRight: 15, color: "inherit", textDecoration: "none" }}
    >
      Главная
    </Link>
    <Link to="/favorites" style={{ color: "inherit", textDecoration: "none" }}>
      Избранное
    </Link>
  </PanelHeader>
);
