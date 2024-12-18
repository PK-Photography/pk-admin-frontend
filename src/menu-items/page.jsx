// assets
import {
  LoginOutlined,
  ProfileOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  SettingOutlined,
};

// ==============================|| MENU ITEMS - EXTRA actions ||============================== //

const actions = {
  id: "authentication",
  title: "Actions",
  type: "group",
  children: [
    {
      id: "ManageAdmin",
      title: "Manage Admin",
      type: "item",
      url: "/admin-management",
      icon: icons.SettingOutlined,
    },
    {
      id: "logout",
      title: "Logout",
      type: "item",
      url: "/logout",
      icon: icons.LoginOutlined,
    },
  ],
};

export default actions;

// assets

// import {
//   LoginOutlined,
//   ProfileOutlined,
//   SettingOutlined,
// } from "@ant-design/icons";

// // icons
// const icons = {
//   LoginOutlined,
//   ProfileOutlined,
//   SettingOutlined,
// };

// // Get role from localStorage
// const role = localStorage.getItem("role");

// // Helper function to conditionally add "Manage Admin" item
// const getMenuItems = () => {
//   const items = [
//     {
//       id: "logout",
//       title: "Logout",
//       type: "item",
//       url: "/logout",
//       icon: icons.LoginOutlined,
//     },
//   ];

//   if (role === "master") {
//     // Add Manage Admin only if the role is "master"
//     items.unshift({
//       id: "ManageAdmin",
//       title: "Manage Admin",
//       type: "item",
//       url: "/admin-management",
//       icon: icons.SettingOutlined,
//     });
//   }

//   return items;
// };

// // ==============================|| MENU ITEMS - EXTRA actions ||============================== //

// const actions = {
//   id: "authentication",
//   title: "Actions",
//   type: "group",
//   children: getMenuItems(), // Dynamically set the menu items
// };

// export default actions;
