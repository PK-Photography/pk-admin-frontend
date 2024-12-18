// assets
import { ChromeOutlined, QuestionOutlined } from "@ant-design/icons";

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: "support",
  title: "Support",
  type: "group",
  children: [
    {
      id: "ask-me",
      title: "Give Feedback",
      type: "item",
      url: "/ask-me",
      icon: icons.QuestionOutlined,
    },
    // {
    //   id: "documentation",
    //   title: "Documentation",
    //   type: "item",
    //   url: "https://codedthemes.gitbook.io/mantis/",
    //   icon: icons.ChromeOutlined,
    //   external: true,
    //   target: true,
    // },
  ],
};

export default support;
